import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '@/services/api';

interface HealthStatus {
  status: 'healthy' | 'error' | 'loading';
  timestamp: number;
  message?: string;
  services?: {
    api: string;
    websocket: string;
    database: string;
  };
}

interface WebSocketStatus {
  connected: boolean;
  connecting: boolean;
  error?: string;
  reconnectAttempts: number;
}

interface ESP32Status {
  url: string;
  connected: boolean;
  loading: boolean;
  error?: string;
  lastPing?: number;
}

export const useSystemStatus = () => {
  const [health, setHealth] = useState<HealthStatus>({
    status: 'loading',
    timestamp: Date.now()
  });
  
  const [websocket, setWebsocket] = useState<WebSocketStatus>({
    connected: false,
    connecting: false,
    reconnectAttempts: 0
  });
  
  const [esp32, setEsp32] = useState<ESP32Status>({
    url: 'http://192.168.1.77',
    connected: false,
    loading: false
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Health check
  const checkHealth = useCallback(async () => {
    try {
      const response = await apiService.healthCheck();
      setHealth({
        status: response.status === 'healthy' ? 'healthy' : 'error',
        timestamp: Date.now(),
        message: response.message,
        services: response.services
      });
    } catch (error) {
      setHealth({
        status: 'error',
        timestamp: Date.now(),
        message: 'Backend unavailable'
      });
    }
  }, []);

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setWebsocket(prev => ({ ...prev, connecting: true, error: undefined }));

    try {
      const ws = new WebSocket(apiService.getWebSocketUrl());
      wsRef.current = ws;

      ws.onopen = () => {
        setWebsocket({
          connected: true,
          connecting: false,
          reconnectAttempts: 0
        });
      };

      ws.onclose = () => {
        setWebsocket(prev => ({
          ...prev,
          connected: false,
          connecting: false
        }));
      };

      ws.onerror = () => {
        setWebsocket(prev => ({
          ...prev,
          connected: false,
          connecting: false,
          error: 'WebSocket connection failed'
        }));
      };

    } catch (error) {
      setWebsocket(prev => ({
        ...prev,
        connected: false,
        connecting: false,
        error: 'Failed to create WebSocket connection'
      }));
    }
  }, []);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setWebsocket({
      connected: false,
      connecting: false,
      reconnectAttempts: 0
    });
  }, []);

  // Reconnect WebSocket
  const reconnectWebSocket = useCallback(() => {
    disconnectWebSocket();
    
    setWebsocket(prev => ({ ...prev, reconnectAttempts: prev.reconnectAttempts + 1 }));
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connectWebSocket();
    }, 2000); // 2 second delay
  }, [connectWebSocket, disconnectWebSocket]);

  // ESP32 ping check
  const pingESP32 = useCallback(async (url?: string) => {
    const targetUrl = url || esp32.url;
    setEsp32(prev => ({ ...prev, loading: true, error: undefined }));

    try {
      const response = await fetch(`${targetUrl}/status`, {
        method: 'GET',
        mode: 'no-cors',
        signal: AbortSignal.timeout(5000)
      });
      
      setEsp32(prev => ({
        ...prev,
        connected: true,
        loading: false,
        lastPing: Date.now()
      }));
    } catch (error) {
      setEsp32(prev => ({
        ...prev,
        connected: false,
        loading: false,
        error: 'ESP32-CAM unavailable'
      }));
    }
  }, [esp32.url]);

  // Update ESP32 URL
  const updateESP32Url = useCallback((url: string) => {
    setEsp32(prev => ({ ...prev, url, connected: false }));
  }, []);

  // Initial setup
  useEffect(() => {
    // Initial health check
    checkHealth();
    
    // Set up periodic health checks
    healthCheckIntervalRef.current = setInterval(checkHealth, 30000); // 30 seconds

    // Initial WebSocket connection
    connectWebSocket();

    // Initial ESP32 ping
    pingESP32();

    return () => {
      // Cleanup
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
      disconnectWebSocket();
    };
  }, [checkHealth, connectWebSocket, disconnectWebSocket, pingESP32]);

  return {
    health,
    websocket,
    esp32,
    actions: {
      checkHealth,
      connectWebSocket,
      disconnectWebSocket,
      reconnectWebSocket,
      pingESP32,
      updateESP32Url
    }
  };
};
