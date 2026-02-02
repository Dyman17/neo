import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  SensorData, 
  SystemStatus, 
  SensorStatus, 
  BlockSummaries,
  ArtifactSummary,
  PreservationSummary,
  MappingSummary,
  RiskLevel
} from '@/types/sensors';

// Simulated sensor data generator for demo
const generateSensorValue = (base: number, variance: number): number => {
  return base + (Math.random() - 0.5) * variance * 2;
};

const getStatus = (value: number, warningLow: number, warningHigh: number, criticalLow: number, criticalHigh: number): SensorStatus => {
  if (value < criticalLow || value > criticalHigh) return 'error';
  if (value < warningLow || value > warningHigh) return 'warning';
  return 'ok';
};

const HISTORY_LENGTH = 60;

// AI Summary calculation functions (simulated - would be backend in production)
function calculateArtifactSummary(sensors: Record<string, SensorData>): ArtifactSummary {
  const magnetic = sensors.magneticAnomaly?.reading.value || 0;
  const sonar = sensors.sonarReturn?.reading.value || 0;
  const spectral = sensors.spectralMatch?.reading.value || 0;
  
  // Weighted calculation for artifact probability
  const probability = Math.min(100, Math.round(
    magnetic * 0.35 + sonar * 0.35 + spectral * 0.30
  ));
  
  // Determine likely material based on spectral signature
  const materials: Array<{ type: ArtifactSummary['likelyMaterial']; threshold: number }> = [
    { type: 'bronze', threshold: 75 },
    { type: 'iron', threshold: 65 },
    { type: 'stone', threshold: 55 },
    { type: 'ceramic', threshold: 45 },
  ];
  
  const likelyMaterial = materials.find(m => spectral > m.threshold)?.type || 'unknown';
  
  return {
    probability,
    likelyMaterial,
    confidence: Math.round((magnetic + spectral) / 2),
    magneticAnomaly: magnetic > 60,
    spectralMatchConfidence: Math.round(spectral),
  };
}

function calculatePreservationSummary(sensors: Record<string, SensorData>): PreservationSummary {
  const temp = sensors.temperature?.reading.value || 20;
  const humidity = sensors.humidity?.reading.value || 50;
  const tds = sensors.tds?.reading.value || 300;
  const oxygen = sensors.dissolvedOxygen?.reading.value || 6;
  const salinity = sensors.salinity?.reading.value || 35;
  
  // Calculate preservation scores for different materials
  const getRiskLevel = (survival: number): RiskLevel => {
    if (survival >= 80) return 'low';
    if (survival >= 60) return 'moderate';
    if (survival >= 40) return 'high';
    return 'critical';
  };
  
  // Wood preservation: affected by oxygen, temperature, salinity
  const woodSurvival = Math.round(100 - (oxygen * 5) - Math.abs(temp - 10) * 2 - (salinity > 40 ? 10 : 0));
  
  // Metal preservation: affected by oxygen, salinity, TDS
  const metalSurvival = Math.round(100 - (oxygen * 8) - (tds / 20) - (salinity > 35 ? 15 : 0));
  
  // Ceramic preservation: generally stable
  const ceramicSurvival = Math.round(90 - Math.abs(temp - 15) - (tds / 50));
  
  // Textile preservation: very sensitive
  const textileSurvival = Math.round(100 - (oxygen * 10) - (humidity > 70 ? 20 : 0) - Math.abs(temp - 8) * 3);
  
  // Water conditions based on TDS and oxygen
  const waterConditions: PreservationSummary['waterConditions'] = 
    oxygen < 3 && tds < 400 ? 'favorable' : 
    oxygen > 6 || tds > 600 ? 'aggressive' : 'moderate';
  
  // Temperature stability (based on variance in history)
  const tempHistory = sensors.temperature?.history || [];
  const tempVariance = tempHistory.length > 1 
    ? Math.max(...tempHistory) - Math.min(...tempHistory) 
    : 0;
  const temperatureStability: PreservationSummary['temperatureStability'] = 
    tempVariance < 2 ? 'stable' : tempVariance < 5 ? 'variable' : 'unstable';
  
  // Overall score (weighted average)
  const overallScore = Math.round(
    woodSurvival * 0.25 + metalSurvival * 0.25 + ceramicSurvival * 0.25 + textileSurvival * 0.25
  );
  
  // Risk factors
  const mainRiskFactors: string[] = [];
  if (oxygen > 5) mainRiskFactors.push('High dissolved oxygen');
  if (tds > 500) mainRiskFactors.push('Elevated TDS levels');
  if (salinity > 40) mainRiskFactors.push('High salinity');
  if (temp > 25 || temp < 5) mainRiskFactors.push('Temperature extremes');
  
  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    materialPredictions: [
      { material: 'wood', survivalProbability: Math.max(0, Math.min(100, woodSurvival)), riskLevel: getRiskLevel(woodSurvival) },
      { material: 'iron', survivalProbability: Math.max(0, Math.min(100, metalSurvival)), riskLevel: getRiskLevel(metalSurvival) },
      { material: 'ceramic', survivalProbability: Math.max(0, Math.min(100, ceramicSurvival)), riskLevel: getRiskLevel(ceramicSurvival) },
      { material: 'textile', survivalProbability: Math.max(0, Math.min(100, textileSurvival)), riskLevel: getRiskLevel(textileSurvival) },
    ],
    waterConditions,
    temperatureStability,
    mainRiskFactors: mainRiskFactors.slice(0, 3),
  };
}

function calculateMappingSummary(sensors: Record<string, SensorData>): MappingSummary {
  const depthAccuracy = sensors.depthAccuracy?.reading.value || 85;
  const gpsAccuracy = sensors.gpsAccuracy?.reading.value || 90;
  const scanCoverage = sensors.scanCoverage?.reading.value || 75;
  const sonar = sensors.sonarReturn?.reading.value || 60;
  
  const accuracy = Math.round((depthAccuracy + gpsAccuracy) / 2);
  
  const surfaceComplexity: MappingSummary['surfaceComplexity'] = 
    sonar > 70 ? 'complex' : sonar > 40 ? 'uneven' : 'flat';
  
  return {
    accuracy,
    surfaceComplexity,
    scanCompleteness: Math.round(scanCoverage),
    anomaliesDetected: Math.floor(sonar / 10),
    depthRange: { min: 2.5, max: 15.8 },
  };
}

export function useSensorData() {
  const [sensors, setSensors] = useState<Record<string, SensorData>>({
    // Block 1: Seafloor & Artifact Detection
    magneticAnomaly: {
      id: 'magneticAnomaly',
      name: 'Magnetic Anomaly',
      category: 'detection',
      reading: { value: 72, unit: '%', timestamp: Date.now(), status: 'ok' },
      history: Array(HISTORY_LENGTH).fill(72),
      thresholds: { warningLow: 20, warningHigh: 90, criticalLow: 10, criticalHigh: 95 },
    },
    sonarReturn: {
      id: 'sonarReturn',
      name: 'Sonar Return',
      category: 'detection',
      reading: { value: 68, unit: '%', timestamp: Date.now(), status: 'ok' },
      history: Array(HISTORY_LENGTH).fill(68),
      thresholds: { warningLow: 30, warningHigh: 95, criticalLow: 15, criticalHigh: 100 },
    },
    spectralMatch: {
      id: 'spectralMatch',
      name: 'Spectral Match',
      category: 'detection',
      reading: { value: 76, unit: '%', timestamp: Date.now(), status: 'ok' },
      history: Array(HISTORY_LENGTH).fill(76),
      thresholds: { warningLow: 40, warningHigh: 100, criticalLow: 20, criticalHigh: 100 },
    },
    
    // Block 2: Environment & Preservation
    temperature: {
      id: 'temperature',
      name: 'Temperature',
      category: 'environmental',
      reading: { value: 12.4, unit: '°C', timestamp: Date.now(), status: 'ok' },
      history: Array(HISTORY_LENGTH).fill(12.4),
      thresholds: { warningLow: 5, warningHigh: 25, criticalLow: 2, criticalHigh: 30 },
    },
    humidity: {
      id: 'humidity',
      name: 'Humidity',
      category: 'environmental',
      reading: { value: 62.1, unit: '%', timestamp: Date.now(), status: 'ok' },
      history: Array(HISTORY_LENGTH).fill(62.1),
      thresholds: { warningLow: 30, warningHigh: 80, criticalLow: 20, criticalHigh: 90 },
    },
    dissolvedOxygen: {
      id: 'dissolvedOxygen',
      name: 'Dissolved O₂',
      category: 'environmental',
      reading: { value: 4.2, unit: 'mg/L', timestamp: Date.now(), status: 'ok' },
      history: Array(HISTORY_LENGTH).fill(4.2),
      thresholds: { warningLow: 2, warningHigh: 8, criticalLow: 1, criticalHigh: 12 },
    },
    salinity: {
      id: 'salinity',
      name: 'Salinity',
      category: 'environmental',
      reading: { value: 35.2, unit: 'PSU', timestamp: Date.now(), status: 'ok' },
      history: Array(HISTORY_LENGTH).fill(35.2),
      thresholds: { warningLow: 30, warningHigh: 40, criticalLow: 25, criticalHigh: 45 },
    },
    tds: {
      id: 'tds',
      name: 'TDS',
      category: 'environmental',
      reading: { value: 342, unit: 'ppm', timestamp: Date.now(), status: 'ok' },
      history: Array(HISTORY_LENGTH).fill(342),
      thresholds: { warningLow: 100, warningHigh: 500, criticalLow: 50, criticalHigh: 800 },
    },
    
    // Block 3: Mapping & Depth Analysis
    depthAccuracy: {
      id: 'depthAccuracy',
      name: 'Depth Accuracy',
      category: 'mapping',
      reading: { value: 88, unit: '%', timestamp: Date.now(), status: 'ok' },
      history: Array(HISTORY_LENGTH).fill(88),
      thresholds: { warningLow: 70, warningHigh: 100, criticalLow: 50, criticalHigh: 100 },
    },
    gpsAccuracy: {
      id: 'gpsAccuracy',
      name: 'GPS Accuracy',
      category: 'mapping',
      reading: { value: 92, unit: '%', timestamp: Date.now(), status: 'ok' },
      history: Array(HISTORY_LENGTH).fill(92),
      thresholds: { warningLow: 75, warningHigh: 100, criticalLow: 60, criticalHigh: 100 },
    },
    scanCoverage: {
      id: 'scanCoverage',
      name: 'Scan Coverage',
      category: 'mapping',
      reading: { value: 78, unit: '%', timestamp: Date.now(), status: 'ok' },
      history: Array(HISTORY_LENGTH).fill(78),
      thresholds: { warningLow: 50, warningHigh: 100, criticalLow: 30, criticalHigh: 100 },
    },
    
    // System
    battery: {
      id: 'battery',
      name: 'Battery',
      category: 'environmental',
      reading: { value: 87, unit: '%', timestamp: Date.now(), status: 'ok' },
      history: Array(HISTORY_LENGTH).fill(87),
      thresholds: { warningLow: 20, warningHigh: 100, criticalLow: 10, criticalHigh: 100 },
    },
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    connection: 'connected',
    battery: 87,
    lastDataTimestamp: Date.now(),
    alerts: [],
  });

  // Calculate AI summaries based on sensor data
  const blockSummaries = useMemo<BlockSummaries>(() => ({
    artifact: calculateArtifactSummary(sensors),
    preservation: calculatePreservationSummary(sensors),
    mapping: calculateMappingSummary(sensors),
    lastUpdated: Date.now(),
  }), [sensors]);

  const updateSensors = useCallback(() => {
    setSensors((prev) => {
      const updated: Record<string, SensorData> = {};
      
      for (const [key, sensor] of Object.entries(prev)) {
        const baseValue = sensor.reading.value;
        let variance = 2;
        
        // Different variance for different sensor types
        if (key === 'tds') variance = 15;
        else if (key === 'battery') variance = 0.1;
        else if (key.includes('Accuracy') || key.includes('Coverage')) variance = 3;
        else if (key === 'salinity') variance = 0.5;
        else if (key === 'dissolvedOxygen') variance = 0.3;
        
        let newValue = generateSensorValue(baseValue, variance);
        
        // Battery slowly decreases
        if (key === 'battery') {
          newValue = Math.max(10, baseValue - Math.random() * 0.05);
        }
        
        // Keep percentages in bounds
        if (sensor.reading.unit === '%') {
          newValue = Math.max(0, Math.min(100, newValue));
        }
        
        const { warningLow = 0, warningHigh = 100, criticalLow = 0, criticalHigh = 100 } = sensor.thresholds || {};
        const status = getStatus(newValue, warningLow, warningHigh, criticalLow, criticalHigh);
        
        const newHistory = [...sensor.history.slice(1), newValue];
        
        updated[key] = {
          ...sensor,
          reading: {
            ...sensor.reading,
            value: parseFloat(newValue.toFixed(2)),
            timestamp: Date.now(),
            status,
            min: Math.min(...newHistory),
            max: Math.max(...newHistory),
          },
          history: newHistory,
        };
      }
      
      return updated;
    });

    setSystemStatus((prev) => ({
      ...prev,
      lastDataTimestamp: Date.now(),
    }));
  }, []);

  useEffect(() => {
    // Update sensors at ~10Hz (100ms intervals)
    const interval = setInterval(updateSensors, 100);
    return () => clearInterval(interval);
  }, [updateSensors]);

  // Simulate connection state changes occasionally
  useEffect(() => {
    const connectionCheck = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.02) {
        setSystemStatus((prev) => ({ ...prev, connection: 'reconnecting' }));
        setTimeout(() => {
          setSystemStatus((prev) => ({ ...prev, connection: 'connected' }));
        }, 2000);
      }
    }, 5000);
    
    return () => clearInterval(connectionCheck);
  }, []);

  return { sensors, systemStatus, blockSummaries };
}
