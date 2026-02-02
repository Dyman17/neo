import { useState, useMemo } from 'react';
import { Layers, FlaskConical, Sparkles, Download, History } from 'lucide-react';

export default function Materials() {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>('sample-1');

  // Simulated spectrum data
  const spectrumData = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const x = 400 + i * 4; // wavelength 400-800nm
      // Simulate peaks
      const peak1 = Math.exp(-Math.pow((x - 520) / 30, 2)) * 80;
      const peak2 = Math.exp(-Math.pow((x - 620) / 25, 2)) * 60;
      const peak3 = Math.exp(-Math.pow((x - 700) / 40, 2)) * 45;
      const noise = Math.random() * 10;
      return { wavelength: x, intensity: peak1 + peak2 + peak3 + noise + 15 };
    });
  }, []);

  const classification = {
    type: 'ceramic' as const,
    confidence: 87.3,
    alternates: [
      { type: 'stone', confidence: 8.2 },
      { type: 'organic', confidence: 4.5 },
    ],
  };

  const materialColors = {
    metal: 'text-status-warning bg-status-warning/10',
    ceramic: 'text-sensor-humidity bg-sensor-humidity/10',
    organic: 'text-status-success bg-status-success/10',
    stone: 'text-muted-foreground bg-muted',
    unknown: 'text-status-error bg-status-error/10',
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Materials</h1>
          <p className="text-sm text-muted-foreground">Spectral analysis and AI classification</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
            <History className="w-4 h-4" />
            History
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1">
        {/* Spectrum graph */}
        <div className="col-span-2 card-instrument p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-muted-foreground" />
              Spectrum Analysis
            </h3>
            <span className="font-mono-data text-xs text-muted-foreground">
              Sample: {selectedMaterial}
            </span>
          </div>

          {/* SVG Spectrum */}
          <div className="flex-1 min-h-[250px] relative">
            <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={200 - y * 2}
                  x2="400"
                  y2={200 - y * 2}
                  stroke="hsl(var(--graph-grid))"
                  strokeWidth="0.5"
                />
              ))}
              
              {/* Spectrum line */}
              <path
                d={`M ${spectrumData.map((d, i) => `${i * 4},${200 - d.intensity * 2}`).join(' L ')}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
              />
              
              {/* Fill area */}
              <path
                d={`M 0,200 L ${spectrumData.map((d, i) => `${i * 4},${200 - d.intensity * 2}`).join(' L ')} L 400,200 Z`}
                fill="hsl(var(--primary))"
                fillOpacity="0.1"
              />

              {/* Peak markers */}
              {[{ x: 120, label: '520nm' }, { x: 220, label: '620nm' }, { x: 300, label: '700nm' }].map((peak) => (
                <g key={peak.label}>
                  <line
                    x1={peak.x}
                    y1="0"
                    x2={peak.x}
                    y2="200"
                    stroke="hsl(var(--status-success))"
                    strokeWidth="1"
                    strokeDasharray="4"
                    opacity="0.5"
                  />
                </g>
              ))}
            </svg>

            {/* Axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs font-mono-data text-muted-foreground">
              <span>400nm</span>
              <span>500nm</span>
              <span>600nm</span>
              <span>700nm</span>
              <span>800nm</span>
            </div>
          </div>

          {/* Peak detection info */}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Detected peaks: 520nm, 620nm, 700nm</span>
            <span className="text-status-success">Noise: Low</span>
            <span>Signal quality: 94.2%</span>
          </div>
        </div>

        {/* Classification panel */}
        <div className="card-instrument p-4 flex flex-col">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            AI Classification
          </h3>

          {/* Primary classification */}
          <div className={`p-4 rounded-md ${materialColors[classification.type]} mb-4`}>
            <div className="text-2xl font-semibold capitalize mb-1">
              {classification.type}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-70">Confidence</span>
              <span className="font-mono-data text-lg">{classification.confidence}%</span>
            </div>
            <div className="mt-2 h-2 bg-background/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-current rounded-full"
                style={{ width: `${classification.confidence}%` }}
              />
            </div>
          </div>

          {/* Alternatives */}
          <div className="space-y-2 mb-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Alternatives</span>
            {classification.alternates.map((alt) => (
              <div key={alt.type} className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm capitalize text-foreground">{alt.type}</span>
                <span className="font-mono-data text-sm text-muted-foreground">{alt.confidence}%</span>
              </div>
            ))}
          </div>

          {/* Reference match */}
          <div className="mt-auto">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
              Reference Match
            </span>
            <div className="card-instrument p-3 bg-secondary/30">
              <div className="text-sm font-medium text-foreground">Roman Terra Sigillata</div>
              <div className="text-xs text-muted-foreground">Period: 1st-3rd century CE</div>
              <div className="text-xs text-status-success mt-1">92% spectral match</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent samples */}
      <div className="card-instrument p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Recent Samples</h3>
        <div className="grid grid-cols-6 gap-3">
          {['sample-1', 'sample-2', 'sample-3', 'sample-4', 'sample-5', 'sample-6'].map((sample, i) => {
            const types = ['ceramic', 'metal', 'stone', 'organic', 'ceramic', 'unknown'] as const;
            return (
              <button
                key={sample}
                onClick={() => setSelectedMaterial(sample)}
                className={`p-3 rounded-md text-left transition-colors ${
                  selectedMaterial === sample
                    ? 'bg-primary/10 border border-primary'
                    : 'bg-secondary/30 hover:bg-secondary/50 border border-transparent'
                }`}
              >
                <div className="font-mono-data text-xs text-foreground">{sample}</div>
                <div className={`text-xs capitalize mt-1 ${materialColors[types[i]].split(' ')[0]}`}>
                  {types[i]}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
