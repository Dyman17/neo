import { MappingSummary as MappingSummaryType } from '@/types/sensors';
import { AISummaryCard } from './AISummaryCard';
import { cn } from '@/lib/utils';
import { Map, Scan, Target, ArrowDownUp } from 'lucide-react';

interface MappingSummaryProps {
  data: MappingSummaryType;
}

const complexityLabels: Record<string, { label: string; color: string }> = {
  flat: { label: 'Flat', color: 'text-status-success' },
  uneven: { label: 'Uneven', color: 'text-status-warning' },
  complex: { label: 'Complex', color: 'text-data-tertiary' },
};

export function MappingSummaryCard({ data }: MappingSummaryProps) {
  const complexity = complexityLabels[data.surfaceComplexity];
  const riskLevel = data.accuracy >= 85 ? 'low' : data.accuracy >= 70 ? 'moderate' : 'high';
  
  return (
    <AISummaryCard
      title="Terrain & Scan Quality"
      percentage={data.accuracy}
      subtitle={`Seafloor structure: ${complexity.label}`}
      description={`${data.anomaliesDetected} object-sized anomalies detected. Scan coverage at ${data.scanCompleteness}% of designated area.`}
      riskLevel={riskLevel}
      trend={data.scanCompleteness > 70 ? 'up' : 'stable'}
    >
      {/* Mapping Stats */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-data-secondary/10 flex items-center justify-center">
            <Scan className="w-4 h-4 text-data-secondary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Coverage</div>
            <div className="text-sm font-mono-data text-foreground">{data.scanCompleteness}%</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-data-tertiary/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-data-tertiary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Anomalies</div>
            <div className="text-sm font-mono-data text-foreground">{data.anomaliesDetected}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-data-quaternary/10 flex items-center justify-center">
            <ArrowDownUp className="w-4 h-4 text-data-quaternary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Depth Range</div>
            <div className="text-sm font-mono-data text-foreground">
              {data.depthRange.min}–{data.depthRange.max}m
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-status-info/10 flex items-center justify-center">
            <Map className="w-4 h-4 text-status-info" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Surface</div>
            <div className={cn('text-sm font-medium', complexity.color)}>
              {complexity.label}
            </div>
          </div>
        </div>
      </div>
    </AISummaryCard>
  );
}
