import { ArtifactSummary as ArtifactSummaryType } from '@/types/sensors';
import { AISummaryCard } from './AISummaryCard';
import { cn } from '@/lib/utils';
import { Magnet, Waves, Sparkles } from 'lucide-react';

interface ArtifactSummaryProps {
  data: ArtifactSummaryType;
}

const materialLabels: Record<string, string> = {
  bronze: 'Bronze',
  iron: 'Iron',
  stone: 'Stone',
  ceramic: 'Ceramic',
  wood: 'Wood',
  textile: 'Textile',
  bone: 'Bone',
  unknown: 'Unknown',
};

export function ArtifactSummaryCard({ data }: ArtifactSummaryProps) {
  const riskLevel = data.probability >= 70 ? 'low' : data.probability >= 50 ? 'moderate' : 'high';
  
  return (
    <AISummaryCard
      title="Artifact Detection Probability"
      percentage={data.probability}
      subtitle={`Likely material: ${materialLabels[data.likelyMaterial]}`}
      description={`Surface spectral match confidence at ${data.spectralMatchConfidence}%. ${data.magneticAnomaly ? 'Magnetic anomaly detected in scan area.' : 'No significant magnetic anomaly.'}`}
      riskLevel={riskLevel}
      trend={data.probability > 70 ? 'up' : 'stable'}
    >
      {/* Detection Indicators */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
        <div className="flex items-center gap-1.5">
          <Magnet className={cn('w-3.5 h-3.5', data.magneticAnomaly ? 'text-status-success' : 'text-muted-foreground')} />
          <span className="text-xs text-muted-foreground">
            {data.magneticAnomaly ? 'Detected' : 'None'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Waves className="w-3.5 h-3.5 text-data-secondary" />
          <span className="text-xs text-muted-foreground font-mono-data">
            {data.confidence}%
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-data-tertiary" />
          <span className="text-xs text-muted-foreground font-mono-data">
            {data.spectralMatchConfidence}%
          </span>
        </div>
      </div>
    </AISummaryCard>
  );
}
