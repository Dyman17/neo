import { SensorData } from '@/types/sensors';
import { MiniTrendGraph } from './MiniTrendGraph';
import { cn } from '@/lib/utils';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Beaker, 
  Battery, 
  Shield,
  Magnet,
  Waves,
  Sparkles,
  Map,
  Navigation,
  Scan,
  Wind
} from 'lucide-react';

interface SensorCardProps {
  sensor: SensorData;
}

const sensorIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  temperature: Thermometer,
  humidity: Droplets,
  pressure: Gauge,
  tds: Beaker,
  battery: Battery,
  preservation: Shield,
  magneticAnomaly: Magnet,
  sonarReturn: Waves,
  spectralMatch: Sparkles,
  depthAccuracy: Map,
  gpsAccuracy: Navigation,
  scanCoverage: Scan,
  dissolvedOxygen: Wind,
  salinity: Droplets,
};

const sensorColors: Record<string, string> = {
  temperature: 'hsl(var(--sensor-temperature))',
  humidity: 'hsl(var(--sensor-humidity))',
  pressure: 'hsl(var(--sensor-pressure))',
  tds: 'hsl(var(--sensor-tds))',
  battery: 'hsl(var(--sensor-battery))',
  preservation: 'hsl(var(--sensor-preservation))',
  magneticAnomaly: 'hsl(var(--data-primary))',
  sonarReturn: 'hsl(var(--data-secondary))',
  spectralMatch: 'hsl(var(--data-tertiary))',
  depthAccuracy: 'hsl(var(--data-quaternary))',
  gpsAccuracy: 'hsl(var(--status-info))',
  scanCoverage: 'hsl(var(--data-secondary))',
  dissolvedOxygen: 'hsl(var(--sensor-humidity))',
  salinity: 'hsl(var(--sensor-tds))',
};

export function SensorCard({ sensor }: SensorCardProps) {
  const Icon = sensorIcons[sensor.id] || Gauge;
  const color = sensorColors[sensor.id] || 'hsl(var(--primary))';
  
  const statusColorClass = {
    ok: 'bg-status-success',
    warning: 'bg-status-warning',
    error: 'bg-status-error',
    offline: 'bg-muted-foreground',
  }[sensor.reading.status];

  const statusTextClass = {
    ok: 'text-status-success',
    warning: 'text-status-warning',
    error: 'text-status-error',
    offline: 'text-muted-foreground',
  }[sensor.reading.status];

  // Format value based on sensor type
  const formatValue = (value: number, id: string) => {
    if (id === 'tds') return value.toFixed(0);
    if (id === 'temperature' || id === 'dissolvedOxygen') return value.toFixed(1);
    if (id.includes('Accuracy') || id.includes('Coverage') || id.includes('Anomaly') || id.includes('Match') || id.includes('Return')) {
      return value.toFixed(0);
    }
    return value.toFixed(1);
  };

  return (
    <div className="card-instrument p-3 flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground truncate">{sensor.name}</span>
        </div>
        <div className={cn('w-1.5 h-1.5 rounded-full', statusColorClass)} />
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold font-mono-data" style={{ color }}>
          {formatValue(sensor.reading.value, sensor.id)}
        </span>
        <span className="text-xs text-muted-foreground">{sensor.reading.unit}</span>
      </div>

      {/* Status & Range */}
      <div className="flex items-center justify-between text-xs">
        <span className={cn('uppercase tracking-wider font-medium text-[10px]', statusTextClass)}>
          {sensor.reading.status}
        </span>
        {sensor.reading.min !== undefined && sensor.reading.max !== undefined && (
          <span className="text-muted-foreground font-mono-data text-[10px]">
            {sensor.reading.min.toFixed(1)}–{sensor.reading.max.toFixed(1)}
          </span>
        )}
      </div>

      {/* Mini graph */}
      <div className="h-8 mt-1">
        <MiniTrendGraph data={sensor.history} color={color} />
      </div>
    </div>
  );
}
