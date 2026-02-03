// Health Check Response
export interface HealthCheckResponse {
  status: 'ok' | 'error' | 'healthy';
  ws?: boolean;
  db?: boolean;
  esp_cam?: boolean;
  timestamp: number;
  message?: string;
  services?: {
    api: string;
    websocket: string;
    database: string;
  };
}

// Settings
export interface AppSettings {
  esp_cam_url: string;
  ws_url: string;
  map_refresh_rate: number;
  video_recording: boolean;
  auto_save_artifacts: boolean;
  gps_enabled: boolean;
  sensor_sensitivity: number;
}

// Artifact
export interface Artifact {
  id: string;
  lat: number;
  lng: number;
  type: 'artifact' | 'structure' | 'anomaly' | 'organic';
  material?: string;
  confidence: number;
  timestamp: number;
  preservation_index?: number;
  depth?: number;
  description?: string;
  properties?: Record<string, any>;
}

// Preservation Analysis
export interface PreservationAnalysis {
  score: number;
  risk: 'low' | 'medium' | 'high';
  comparison: Array<{
    material: string;
    preservation: number;
  }>;
  recommendations: string[];
}

// Video Recording
export interface VideoRecording {
  id: string;
  filename: string;
  start_time: number;
  end_time?: number;
  duration?: number;
  size: number;
  location?: {
    lat: number;
    lng: number;
  };
  artifacts_detected: string[];
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
