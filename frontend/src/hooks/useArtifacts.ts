import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/services/api';
import { Artifact } from '@/types/api';

export function useArtifacts() {
  const queryClient = useQueryClient();

  // Получаем все артефакты
  const {
    data: artifacts = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['artifacts'],
    queryFn: () => apiService.getArtifacts(),
    refetchInterval: 5000, // Обновляем каждые 5 секунд
    staleTime: 1000,
  });

  // Сохраняем новый артефакт
  const saveArtifactMutation = useMutation({
    mutationFn: (artifact: Omit<Artifact, 'id' | 'timestamp'>) => 
      apiService.saveArtifact(artifact),
    onSuccess: (newArtifact) => {
      // Добавляем новый артефакт в кэш
      queryClient.setQueryData(['artifacts'], (old: Artifact[] = []) => 
        [...old, newArtifact]
      );
    },
  });

  // Анализ сохранения артефакта
  const analyzePreservationMutation = useMutation({
    mutationFn: (artifactId: string) => 
      apiService.analyzePreservation(artifactId),
    onSuccess: (analysis, artifactId) => {
      // Обновляем артефакт с результатами анализа
      queryClient.setQueryData(['artifacts'], (old: Artifact[] = []) => 
        old.map(artifact => 
          artifact.id === artifactId 
            ? { ...artifact, preservation_index: analysis.score }
            : artifact
        )
      );
    },
  });

  const saveArtifact = async (artifact: Omit<Artifact, 'id' | 'timestamp'>) => {
    return saveArtifactMutation.mutateAsync(artifact);
  };

  const analyzePreservation = async (artifactId: string) => {
    return analyzePreservationMutation.mutateAsync(artifactId);
  };

  return {
    artifacts,
    isLoading,
    error,
    refetch,
    saveArtifact,
    analyzePreservation,
    isSaving: saveArtifactMutation.isPending,
    isAnalyzing: analyzePreservationMutation.isPending,
  };
}

// Хук для работы с WebSocket
export function useArtifactWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const wsUrl = apiService.getWebSocketUrl();
    let ws: WebSocket | null = null;

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
          console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'new_artifact') {
              // Добавляем новый артефакт в реальном времени
              queryClient.setQueryData(['artifacts'], (old: Artifact[] = []) => 
                [...old, data.artifact]
              );
            } else if (data.type === 'artifact_update') {
              // Обновляем существующий артефакт
              queryClient.setQueryData(['artifacts'], (old: Artifact[] = []) => 
                old.map(artifact => 
                  artifact.id === data.artifact.id 
                    ? { ...artifact, ...data.artifact }
                    : artifact
                )
              );
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          console.log('WebSocket disconnected');
          // Попытка переподключения через 5 секунд
          setTimeout(connect, 5000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [queryClient]);

  return { isConnected };
}
