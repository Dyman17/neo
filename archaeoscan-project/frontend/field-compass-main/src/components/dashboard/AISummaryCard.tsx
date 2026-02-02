import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types/sensors';
import { Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AISummaryCardProps {
  title: string;
  percentage: number;
  subtitle: string;
  description: string;
  trend?: 'up' | 'down' | 'stable';
  riskLevel?: RiskLevel;
  children?: React.ReactNode;
}

const riskColors: Record<RiskLevel, string> = {
  low: 'text-status-success',
  moderate: 'text-status-warning',
  high: 'text-status-error',
  critical: 'text-status-error',
};

const percentageColors = (value: number) => {
  if (value >= 80) return 'text-status-success';
  if (value >= 60) return 'text-status-warning';
  if (value >= 40) return 'text-amber-500';
  return 'text-status-error';
};

const progressBarColors = (value: number) => {
  if (value >= 80) return 'bg-status-success';
  if (value >= 60) return 'bg-status-warning';
  if (value >= 40) return 'bg-amber-500';
  return 'bg-status-error';
};

export function AISummaryCard({ 
  title, 
  percentage, 
  subtitle, 
  description, 
  trend = 'stable',
  riskLevel,
  children 
}: AISummaryCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  return (
    <div className="card-instrument p-4 border-l-2 border-l-data-primary bg-gradient-to-r from-data-primary/5 to-transparent">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-data-primary/20 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-data-primary" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            AI Summary
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendIcon className="w-3 h-3" />
          <span>{trend}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>

      {/* Main Percentage */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className={cn('text-4xl font-bold font-mono-data', percentageColors(percentage))}>
          {percentage}
        </span>
        <span className="text-lg text-muted-foreground">%</span>
        {riskLevel && (
          <span className={cn('text-xs uppercase font-medium ml-2', riskColors[riskLevel])}>
            {riskLevel} risk
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-muted rounded-full mb-3 overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all duration-500', progressBarColors(percentage))}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Subtitle */}
      <div className="text-sm font-medium text-foreground mb-1">{subtitle}</div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{description}</p>

      {/* Additional Content */}
      {children}
    </div>
  );
}
