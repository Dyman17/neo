// Sensor data types for ArchaeoScan

export type SensorStatus = 'ok' | 'warning' | 'error' | 'offline';

export type ConnectionState = 'connected' | 'reconnecting' | 'offline';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface SensorReading {
  value: number;
  unit: string;
  timestamp: number;
  status: SensorStatus;
  min?: number;
  max?: number;
}

export interface SensorData {
  id: string;
  name: string;
  category: 'environmental' | 'motion' | 'magnetic' | 'position' | 'detection' | 'mapping';
  reading: SensorReading;
  history: number[];
  thresholds?: {
    warningLow?: number;
    warningHigh?: number;
    criticalLow?: number;
    criticalHigh?: number;
  };
}

export interface SystemStatus {
  connection: ConnectionState;
  battery: number;
  lastDataTimestamp: number;
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

export interface ProjectInfo {
  name: string;
  location: string;
  startDate: string;
}

export interface RadarData {
  depth: number;
  intensity: number[][];
  anomalies: RadarAnomaly[];
}

export interface RadarAnomaly {
  id: string;
  x: number;
  y: number;
  depth: number;
  size: number;
  confidence: number;
}

export interface MaterialClassification {
  type: 'metal' | 'ceramic' | 'organic' | 'stone' | 'unknown';
  confidence: number;
  spectrum: number[];
  peaks: number[];
}

export interface GPSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  timestamp: number;
}

// AI Summary Types
export type MaterialType = 'bronze' | 'iron' | 'stone' | 'ceramic' | 'wood' | 'textile' | 'bone' | 'unknown';

export interface ArtifactSummary {
  probability: number;
  likelyMaterial: MaterialType;
  confidence: number;
  magneticAnomaly: boolean;
  spectralMatchConfidence: number;
}

export interface PreservationSummary {
  overallScore: number;
  materialPredictions: {
    material: MaterialType;
    survivalProbability: number;
    riskLevel: RiskLevel;
  }[];
  waterConditions: 'favorable' | 'moderate' | 'aggressive';
  temperatureStability: 'stable' | 'variable' | 'unstable';
  mainRiskFactors: string[];
}

export interface MappingSummary {
  accuracy: number;
  surfaceComplexity: 'flat' | 'uneven' | 'complex';
  scanCompleteness: number;
  anomaliesDetected: number;
  depthRange: { min: number; max: number };
}

export interface BlockSummaries {
  artifact: ArtifactSummary;
  preservation: PreservationSummary;
  mapping: MappingSummary;
  lastUpdated: number;
}
