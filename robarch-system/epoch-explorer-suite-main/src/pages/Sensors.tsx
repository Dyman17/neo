import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Waves,
  Droplets,
  Radio,
  Compass,
  Battery,
  Navigation,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
} from "lucide-react";
import { SensorCard, SensorStatus } from "@/components/dashboard/SensorCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SensorReading {
  timestamp: number;
  value: number;
}

interface DetailedSensor {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  currentValue: number;
  unit: string;
  status: SensorStatus;
  trend: "up" | "down" | "stable";
  history: SensorReading[];
  min: number;
  max: number;
  avg: number;
}

const generateHistory = (baseValue: number, variance: number, points: number = 20): SensorReading[] => {
  return Array.from({ length: points }, (_, i) => ({
    timestamp: Date.now() - (points - i) * 5000,
    value: baseValue + (Math.random() - 0.5) * variance,
  }));
};

const initialSensors: DetailedSensor[] = [
  {
    id: "piezo",
    icon: Waves,
    label: "Пьезо",
    description: "Пьезоэлектрический датчик измеряет механические вибрации и преобразует их в электрический сигнал. Используется для обнаружения подземных полостей и структур.",
    currentValue: 42.7,
    unit: "мВ",
    status: "ok",
    trend: "stable",
    history: generateHistory(42, 5),
    min: 38.2,
    max: 47.8,
    avg: 42.3,
  },
  {
    id: "tds",
    icon: Droplets,
    label: "TDS",
    description: "Total Dissolved Solids — показатель общего содержания растворённых твёрдых веществ в воде. Высокие значения могут указывать на древние захоронения или органические отложения.",
    currentValue: 523,
    unit: "ppm",
    status: "ok",
    trend: "up",
    history: generateHistory(520, 30),
    min: 489,
    max: 558,
    avg: 521,
  },
  {
    id: "ultrasound",
    icon: Radio,
    label: "Ультразвук",
    description: "Ультразвуковой датчик определяет расстояние до объектов под землёй путём измерения времени отражения звуковых волн. Позволяет строить профиль подземных слоёв.",
    currentValue: 2.34,
    unit: "м",
    status: "ok",
    trend: "down",
    history: generateHistory(2.3, 0.2),
    min: 2.12,
    max: 2.51,
    avg: 2.32,
  },
  {
    id: "magnetometer",
    icon: Compass,
    label: "Магнитометр",
    description: "Измеряет локальные вариации магнитного поля. Позволяет обнаруживать металлические объекты, обожжённую глину и следы древних построек.",
    currentValue: 48.2,
    unit: "мкТл",
    status: "warning",
    trend: "up",
    history: generateHistory(47, 3),
    min: 44.1,
    max: 52.3,
    avg: 47.8,
  },
  {
    id: "battery",
    icon: Battery,
    label: "Батарея",
    description: "Уровень заряда аккумулятора зонда. При падении ниже 20% рекомендуется завершить сеанс и подзарядить устройство.",
    currentValue: 78,
    unit: "%",
    status: "ok",
    trend: "down",
    history: generateHistory(80, 2),
    min: 76,
    max: 82,
    avg: 79,
  },
  {
    id: "gps",
    icon: Navigation,
    label: "GPS",
    description: "Глобальная система позиционирования. Точность зависит от количества доступных спутников и атмосферных условий.",
    currentValue: 55.7558,
    unit: "°N",
    status: "ok",
    trend: "stable",
    history: generateHistory(55.7558, 0.0001),
    min: 55.7557,
    max: 55.7559,
    avg: 55.7558,
  },
];

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-status-ok" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-status-warning" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

export default function Sensors() {
  const [sensors, setSensors] = useState<DetailedSensor[]>(initialSensors);
  const [selectedSensor, setSelectedSensor] = useState<DetailedSensor | null>(initialSensors[0]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => {
          const variance = sensor.id === "gps" ? 0.0001 : sensor.currentValue * 0.02;
          const newValue = sensor.currentValue + (Math.random() - 0.5) * variance;
          const newHistory = [
            ...sensor.history.slice(1),
            { timestamp: Date.now(), value: newValue },
          ];

          return {
            ...sensor,
            currentValue: newValue,
            history: newHistory,
            min: Math.min(sensor.min, newValue),
            max: Math.max(sensor.max, newValue),
          };
        })
      );

      // Update selected sensor if it exists
      if (selectedSensor) {
        setSelectedSensor((prev) => {
          if (!prev) return null;
          return sensors.find((s) => s.id === prev.id) || prev;
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive, sensors, selectedSensor]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Сенсоры</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Мониторинг датчиков в реальном времени
          </p>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isLive ? "bg-status-ok/20 text-status-ok" : "bg-muted text-muted-foreground"
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isLive ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
          <span className="text-sm font-medium">{isLive ? "LIVE" : "Пауза"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sensor Cards */}
        <div className="xl:col-span-1 space-y-3">
          {sensors.map((sensor, index) => (
            <motion.button
              key={sensor.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => setSelectedSensor(sensor)}
              className={`w-full text-left science-card p-4 transition-all ${
                selectedSensor?.id === sensor.id
                  ? "ring-1 ring-primary"
                  : "hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <sensor.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="data-label">{sensor.label}</div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-mono">
                        {sensor.id === "gps" 
                          ? sensor.currentValue.toFixed(4)
                          : sensor.currentValue.toFixed(sensor.unit === "%" ? 0 : 1)
                        }
                      </span>
                      <span className="data-unit text-sm">{sensor.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`status-dot status-dot-${sensor.status}`} />
                  <TrendIcon trend={sensor.trend} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="xl:col-span-2">
          {selectedSensor && (
            <motion.div
              key={selectedSensor.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="science-card h-full"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <selectedSensor.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedSensor.label}</h3>
                    <p className="text-xs text-muted-foreground">Детальный анализ</p>
                  </div>
                </div>
                <div className={`status-dot status-dot-${selectedSensor.status}`} />
              </div>

              <div className="p-4 space-y-6">
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedSensor.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="data-label mb-1">Текущее</div>
                    <div className="text-lg font-mono text-foreground">
                      {selectedSensor.id === "gps"
                        ? selectedSensor.currentValue.toFixed(4)
                        : selectedSensor.currentValue.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="data-label mb-1">Мин</div>
                    <div className="text-lg font-mono text-status-info">
                      {selectedSensor.id === "gps"
                        ? selectedSensor.min.toFixed(4)
                        : selectedSensor.min.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="data-label mb-1">Макс</div>
                    <div className="text-lg font-mono text-status-warning">
                      {selectedSensor.id === "gps"
                        ? selectedSensor.max.toFixed(4)
                        : selectedSensor.max.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="data-label mb-1">Среднее</div>
                    <div className="text-lg font-mono text-status-ok">
                      {selectedSensor.id === "gps"
                        ? selectedSensor.avg.toFixed(4)
                        : selectedSensor.avg.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedSensor.history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(ts) => new Date(ts).toLocaleTimeString("ru-RU", { minute: "2-digit", second: "2-digit" })}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                      />
                      <YAxis
                        domain={["auto", "auto"]}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickFormatter={(v) => v.toFixed(selectedSensor.id === "gps" ? 4 : 1)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        labelFormatter={(ts) => new Date(ts).toLocaleTimeString("ru-RU")}
                        formatter={(value: number) => [
                          `${value.toFixed(selectedSensor.id === "gps" ? 4 : 2)} ${selectedSensor.unit}`,
                          selectedSensor.label,
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
