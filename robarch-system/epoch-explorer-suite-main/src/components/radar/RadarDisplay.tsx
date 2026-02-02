import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radar, Target, Layers } from "lucide-react";

interface RadarPoint {
  id: string;
  distance: number; // 0-100 normalized
  angle: number; // 0-360 degrees
  intensity: number; // 0-1
  type: "artifact" | "anomaly" | "structure";
}

const mockPoints: RadarPoint[] = [
  { id: "1", distance: 35, angle: 45, intensity: 0.8, type: "artifact" },
  { id: "2", distance: 60, angle: 120, intensity: 0.6, type: "anomaly" },
  { id: "3", distance: 80, angle: 200, intensity: 0.9, type: "structure" },
  { id: "4", distance: 25, angle: 280, intensity: 0.4, type: "artifact" },
  { id: "5", distance: 50, angle: 330, intensity: 0.7, type: "anomaly" },
];

const typeColors = {
  artifact: "hsl(var(--status-ok))",
  anomaly: "hsl(var(--status-ai))",
  structure: "hsl(var(--status-info))",
};

export function RadarDisplay() {
  const [sweepAngle, setSweepAngle] = useState(0);
  const [points] = useState<RadarPoint[]>(mockPoints);
  const [visiblePoints, setVisiblePoints] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Reveal points as sweep passes them
  useEffect(() => {
    points.forEach((point) => {
      const angleDiff = Math.abs(sweepAngle - point.angle);
      if (angleDiff < 10 || angleDiff > 350) {
        setVisiblePoints((prev) => new Set([...prev, point.id]));
      }
    });
  }, [sweepAngle, points]);

  return (
    <div className="science-card h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Radar className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Радар зондирования</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-status-ok" />
            <span>Артефакт</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-status-ai" />
            <span>Аномалия</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-status-info" />
            <span>Структура</span>
          </div>
        </div>
      </div>

      <div className="p-6 flex items-center justify-center">
        <div className="relative w-72 h-72 lg:w-80 lg:h-80">
          {/* Radar circles */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Grid circles */}
            {[25, 50, 75, 100].map((r) => (
              <circle
                key={r}
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
              />
            ))}

            {/* Grid lines */}
            {[0, 45, 90, 135].map((angle) => (
              <line
                key={angle}
                x1="100"
                y1="100"
                x2={100 + 100 * Math.cos((angle * Math.PI) / 180)}
                y2={100 + 100 * Math.sin((angle * Math.PI) / 180)}
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
              />
            ))}
            {[0, 45, 90, 135].map((angle) => (
              <line
                key={`neg-${angle}`}
                x1="100"
                y1="100"
                x2={100 - 100 * Math.cos((angle * Math.PI) / 180)}
                y2={100 - 100 * Math.sin((angle * Math.PI) / 180)}
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
              />
            ))}

            {/* Sweep line */}
            <line
              x1="100"
              y1="100"
              x2={100 + 95 * Math.cos((sweepAngle * Math.PI) / 180)}
              y2={100 + 95 * Math.sin((sweepAngle * Math.PI) / 180)}
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              opacity="0.8"
            />

            {/* Sweep gradient cone */}
            <defs>
              <linearGradient
                id="sweepGradient"
                gradientTransform={`rotate(${sweepAngle}, 100, 100)`}
              >
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M 100 100 L ${100 + 95 * Math.cos((sweepAngle * Math.PI) / 180)} ${100 + 95 * Math.sin((sweepAngle * Math.PI) / 180)} A 95 95 0 0 0 ${100 + 95 * Math.cos(((sweepAngle - 30) * Math.PI) / 180)} ${100 + 95 * Math.sin(((sweepAngle - 30) * Math.PI) / 180)} Z`}
              fill="url(#sweepGradient)"
            />

            {/* Points */}
            {points.map((point) => {
              const x = 100 + (point.distance) * Math.cos((point.angle * Math.PI) / 180);
              const y = 100 + (point.distance) * Math.sin((point.angle * Math.PI) / 180);
              const isVisible = visiblePoints.has(point.id);

              return (
                <g key={point.id}>
                  {isVisible && (
                    <>
                      <circle
                        cx={x}
                        cy={y}
                        r={4 + point.intensity * 3}
                        fill={typeColors[point.type]}
                        opacity={0.2}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={2}
                        fill={typeColors[point.type]}
                      />
                    </>
                  )}
                </g>
              );
            })}

            {/* Center point */}
            <circle cx="100" cy="100" r="3" fill="hsl(var(--primary))" />
          </svg>

          {/* Labels */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-xs font-mono text-muted-foreground">
            N
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-xs font-mono text-muted-foreground">
            S
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 text-xs font-mono text-muted-foreground">
            W
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 text-xs font-mono text-muted-foreground">
            E
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-4 pb-4">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <Target className="w-4 h-4 mx-auto mb-1 text-status-ok" />
          <div className="text-lg font-mono text-status-ok">{points.filter(p => p.type === "artifact").length}</div>
          <div className="text-xs text-muted-foreground">Артефактов</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <Radar className="w-4 h-4 mx-auto mb-1 text-status-ai" />
          <div className="text-lg font-mono text-status-ai">{points.filter(p => p.type === "anomaly").length}</div>
          <div className="text-xs text-muted-foreground">Аномалий</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <Layers className="w-4 h-4 mx-auto mb-1 text-status-info" />
          <div className="text-lg font-mono text-status-info">{points.filter(p => p.type === "structure").length}</div>
          <div className="text-xs text-muted-foreground">Структур</div>
        </div>
      </div>
    </div>
  );
}
