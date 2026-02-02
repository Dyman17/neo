import { useMemo } from 'react';

interface MiniTrendGraphProps {
  data: number[];
  color?: string;
  height?: number;
}

export function MiniTrendGraph({ data, color = 'hsl(var(--graph-line))', height = 48 }: MiniTrendGraphProps) {
  const pathData = useMemo(() => {
    if (data.length < 2) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const width = 100;
    const padding = 2;
    const effectiveHeight = height - padding * 2;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = effectiveHeight - ((value - min) / range) * effectiveHeight + padding;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data, height]);

  const fillPathData = useMemo(() => {
    if (data.length < 2) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const width = 100;
    const padding = 2;
    const effectiveHeight = height - padding * 2;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = effectiveHeight - ((value - min) / range) * effectiveHeight + padding;
      return `${x},${y}`;
    });

    return `M 0,${height} L ${points.join(' L ')} L 100,${height} Z`;
  }, [data, height]);

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      {/* Fill area */}
      <path
        d={fillPathData}
        fill={color}
        fillOpacity="0.1"
      />
      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
