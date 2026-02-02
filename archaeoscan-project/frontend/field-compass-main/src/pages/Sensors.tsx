import { useOutletContext } from 'react-router-dom';
import { SensorData, SystemStatus } from '@/types/sensors';
import { Activity, Settings2, Download, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorsContext {
  sensors: Record<string, SensorData>;
  systemStatus: SystemStatus;
}

export default function Sensors() {
  const { sensors } = useOutletContext<SensorsContext>();

  const sensorList = Object.values(sensors);

  const categoryLabels: Record<string, string> = {
    environmental: 'Environmental',
    motion: 'Motion',
    magnetic: 'Magnetic',
    position: 'Position (GPS)',
  };

  const statusBadgeClass = {
    ok: 'bg-status-success/10 text-status-success border-status-success/20',
    warning: 'bg-status-warning/10 text-status-warning border-status-warning/20',
    error: 'bg-status-error/10 text-status-error border-status-error/20',
    offline: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Sensors</h1>
          <p className="text-sm text-muted-foreground">Detailed sensor monitoring and calibration</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Sensor Categories */}
      {Object.entries(categoryLabels).map(([category, label]) => {
        const categorySensors = sensorList.filter(s => s.category === category);
        if (categorySensors.length === 0) return null;

        return (
          <div key={category}>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {label}
            </h2>
            
            <div className="card-instrument divide-y divide-border">
              {categorySensors.map((sensor) => (
                <div
                  key={sensor.id}
                  className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer group"
                >
                  {/* Left: Name and status */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center">
                      <Activity className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{sensor.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Last updated: {new Date(sensor.reading.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  {/* Center: Live value */}
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono-data text-2xl text-foreground">
                      {sensor.reading.value.toFixed(sensor.id === 'tds' ? 0 : 1)}
                    </span>
                    <span className="text-sm text-muted-foreground">{sensor.reading.unit}</span>
                  </div>

                  {/* Right: Min/Max and status */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Min / Max</div>
                      <div className="font-mono-data text-sm text-foreground">
                        {sensor.reading.min?.toFixed(1) ?? '--'} / {sensor.reading.max?.toFixed(1) ?? '--'}
                      </div>
                    </div>

                    <span className={cn(
                      'px-2 py-1 text-xs font-medium uppercase tracking-wider rounded border',
                      statusBadgeClass[sensor.reading.status]
                    )}>
                      {sensor.reading.status}
                    </span>

                    <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Settings2 className="w-4 h-4" />
                    </button>

                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
