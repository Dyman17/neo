import { PreservationSummary as PreservationSummaryType, RiskLevel } from '@/types/sensors';
import { AISummaryCard } from './AISummaryCard';
import { cn } from '@/lib/utils';
import { TreeDeciduous, Layers, CircleDot, Shirt, AlertTriangle } from 'lucide-react';

interface PreservationSummaryProps {
  data: PreservationSummaryType;
}

const materialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wood: TreeDeciduous,
  iron: Layers,
  ceramic: CircleDot,
  textile: Shirt,
};

const riskColors: Record<RiskLevel, string> = {
  low: 'bg-status-success',
  moderate: 'bg-status-warning',
  high: 'bg-amber-500',
  critical: 'bg-status-error',
};

const riskBgColors: Record<RiskLevel, string> = {
  low: 'bg-status-success/10',
  moderate: 'bg-status-warning/10',
  high: 'bg-amber-500/10',
  critical: 'bg-status-error/10',
};

export function PreservationSummaryCard({ data }: PreservationSummaryProps) {
  const overallRisk: RiskLevel = 
    data.overallScore >= 70 ? 'low' : 
    data.overallScore >= 50 ? 'moderate' : 
    data.overallScore >= 30 ? 'high' : 'critical';
  
  return (
    <AISummaryCard
      title="Preservation State Prediction"
      percentage={data.overallScore}
      subtitle={`Water conditions: ${data.waterConditions}`}
      description={`Organic materials are likely preserved at ~${data.overallScore}% under current conditions. Temperature stability is ${data.temperatureStability}.`}
      riskLevel={overallRisk}
      trend={data.overallScore > 60 ? 'stable' : 'down'}
    >
      {/* Material Predictions */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
        {data.materialPredictions.map((pred) => {
          const Icon = materialIcons[pred.material] || Layers;
          return (
            <div 
              key={pred.material}
              className={cn('flex items-center gap-2 p-2 rounded', riskBgColors[pred.riskLevel])}
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground capitalize truncate">
                  {pred.material}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn('h-full rounded-full', riskColors[pred.riskLevel])}
                      style={{ width: `${pred.survivalProbability}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono-data text-muted-foreground">
                    {pred.survivalProbability}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Factors */}
      {data.mainRiskFactors.length > 0 && (
        <div className="mt-3 pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle className="w-3 h-3 text-status-warning" />
            <span className="text-xs font-medium text-muted-foreground">Risk Factors</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {data.mainRiskFactors.map((factor, i) => (
              <span 
                key={i}
                className="text-xs px-2 py-0.5 rounded bg-status-warning/10 text-status-warning"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}
    </AISummaryCard>
  );
}
