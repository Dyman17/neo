import { useOutletContext } from 'react-router-dom';
import { SensorBlock } from '@/components/dashboard/SensorBlock';
import { ArtifactSummaryCard } from '@/components/dashboard/ArtifactSummary';
import { PreservationSummaryCard } from '@/components/dashboard/PreservationSummary';
import { MappingSummaryCard } from '@/components/dashboard/MappingSummary';
import { SensorData, SystemStatus, BlockSummaries } from '@/types/sensors';
import { Activity, Clock, Database, Radio, Anchor, Leaf, Map } from 'lucide-react';

interface DashboardContext {
  sensors: Record<string, SensorData>;
  systemStatus: SystemStatus;
  blockSummaries: BlockSummaries;
}

export default function Dashboard() {
  const { sensors, systemStatus, blockSummaries } = useOutletContext<DashboardContext>();

  // Group sensors by block
  const detectionSensors = Object.values(sensors).filter(s => s.category === 'detection');
  const environmentalSensors = Object.values(sensors).filter(s => 
    s.category === 'environmental' && s.id !== 'battery'
  );
  const mappingSensors = Object.values(sensors).filter(s => s.category === 'mapping');
  
  const activeSensors = Object.values(sensors).filter(s => s.reading.status !== 'offline').length;
  const totalSensors = Object.values(sensors).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time system overview with AI analysis</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            <span className="font-mono-data">1000 pts buffer</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span className="font-mono-data">10 Hz</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-instrument p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-status-success/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-status-success" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Active Sensors</div>
            <div className="font-mono-data text-lg text-foreground">
              {activeSensors}/{totalSensors}
            </div>
          </div>
        </div>

        <div className="card-instrument p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-status-warning/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-status-warning" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Session Time</div>
            <div className="font-mono-data text-lg text-foreground">02:34:18</div>
          </div>
        </div>

        <div className="card-instrument p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-status-info/10 flex items-center justify-center">
            <Radio className="w-5 h-5 text-status-info" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Radar Scans</div>
            <div className="font-mono-data text-lg text-foreground">847</div>
          </div>
        </div>

        <div className="card-instrument p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-data-quaternary/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-data-quaternary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Anomalies</div>
            <div className="font-mono-data text-lg text-foreground">
              {blockSummaries.mapping.anomaliesDetected}
            </div>
          </div>
        </div>
      </div>

      {/* Block 1: Seafloor & Artifact Detection */}
      <SensorBlock
        title="Seafloor & Artifact Detection"
        icon={Anchor}
        iconColor="bg-data-primary/20 text-data-primary"
        sensors={detectionSensors}
        summaryCard={<ArtifactSummaryCard data={blockSummaries.artifact} />}
      />

      {/* Block 2: Environment & Preservation */}
      <SensorBlock
        title="Environment & Preservation"
        icon={Leaf}
        iconColor="bg-status-success/20 text-status-success"
        sensors={environmentalSensors}
        summaryCard={<PreservationSummaryCard data={blockSummaries.preservation} />}
      />

      {/* Block 3: Mapping & Depth Analysis */}
      <SensorBlock
        title="Mapping & Depth Analysis"
        icon={Map}
        iconColor="bg-data-secondary/20 text-data-secondary"
        sensors={mappingSensors}
        summaryCard={<MappingSummaryCard data={blockSummaries.mapping} />}
      />

      {/* Data Quality Indicator */}
      <div className="card-instrument p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Signal Quality</span>
          <span className="font-mono-data text-sm text-status-success">98.7%</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-2 rounded-sm bg-status-success"
              style={{ opacity: 0.3 + Math.random() * 0.7 }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Packet Loss: 0.02%</span>
          <span>Noise Level: Low</span>
          <span>Confidence: High</span>
        </div>
      </div>
    </div>
  );
}
