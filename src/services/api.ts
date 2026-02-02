import { 
  HealthCheckResponse, 
  AppSettings, 
  Artifact, 
  PreservationAnalysis, 
  VideoRecording,
  ApiResponse 
} from '@/types/api';

// Базовый URL API - будет заменен на реальный
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Health Check
  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        status: 'error',
        timestamp: Date.now(),
        message: 'Backend unavailable'
      };
    }
  }

  // Settings
  async getSettings(): Promise<AppSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/settings`);
      const result: ApiResponse<AppSettings> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to fetch settings');
    } catch (error) {
      // Возвращаем настройки по умолчанию
      return this.getDefaultSettings();
    }
  }

  async saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      const result: ApiResponse<AppSettings> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to save settings');
    } catch (error) {
      throw new Error('Failed to save settings');
    }
  }

  // Artifacts
  async getArtifacts(): Promise<Artifact[]> {
    try {
      const response = await fetch(`${this.baseUrl}/artifacts`);
      const result: ApiResponse<Artifact[]> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  async saveArtifact(artifact: Omit<Artifact, 'id' | 'timestamp'>): Promise<Artifact> {
    try {
      const response = await fetch(`${this.baseUrl}/artifacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artifact),
      });
      const result: ApiResponse<Artifact> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to save artifact');
    } catch (error) {
      throw new Error('Failed to save artifact');
    }
  }

  // Preservation Analysis
  async analyzePreservation(artifactId: string): Promise<PreservationAnalysis> {
    try {
      const response = await fetch(`${this.baseUrl}/artifacts/${artifactId}/analyze`, {
        method: 'POST',
      });
      const result: ApiResponse<PreservationAnalysis> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to analyze preservation');
    } catch (error) {
      throw new Error('Failed to analyze preservation');
    }
  }

  // Video Recording
  async startRecording(): Promise<{ recording_id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/video/start`, {
        method: 'POST',
      });
      const result: ApiResponse<{ recording_id: string }> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to start recording');
    } catch (error) {
      throw new Error('Failed to start recording');
    }
  }

  async stopRecording(recordingId: string): Promise<VideoRecording> {
    try {
      const response = await fetch(`${this.baseUrl}/video/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recording_id: recordingId }),
      });
      const result: ApiResponse<VideoRecording> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to stop recording');
    } catch (error) {
      throw new Error('Failed to stop recording');
    }
  }

  async getRecordings(): Promise<VideoRecording[]> {
    try {
      const response = await fetch(`${this.baseUrl}/video/list`);
      const result: ApiResponse<VideoRecording[]> = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  // ESP32-CAM проверка
  async checkEspCam(url: string): Promise<boolean> {
    try {
      const response = await fetch(`${url}/status`, { 
        method: 'GET',
        mode: 'no-cors' // ESP32 может не поддерживать CORS
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // WebSocket URL
  getWebSocketUrl(): string {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
    return wsUrl;
  }

  // Настройки по умолчанию
  private getDefaultSettings(): AppSettings {
    return {
      esp_cam_url: 'http://192.168.1.77',
      ws_url: 'ws://localhost:8000/ws',
      map_refresh_rate: 1000,
      video_recording: false,
      auto_save_artifacts: true,
      gps_enabled: true,
      sensor_sensitivity: 75,
    };
  }
}

export const apiService = new ApiService();
export default apiService;
