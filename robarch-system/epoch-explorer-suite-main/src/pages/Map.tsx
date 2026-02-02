import { useState } from "react";
import { motion } from "framer-motion";
import { Map as MapIcon, Layers, Navigation, MapPin, Clock, ChevronDown, Plus } from "lucide-react";

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: "artifact" | "anomaly" | "structure" | "poi";
  timestamp: Date;
}

const mockMarkers: MarkerData[] = [
  { id: "1", lat: 55.7558, lng: 37.6173, label: "Керамические фрагменты", type: "artifact", timestamp: new Date() },
  { id: "2", lat: 55.7548, lng: 37.6193, label: "Магнитная аномалия", type: "anomaly", timestamp: new Date(Date.now() - 3600000) },
  { id: "3", lat: 55.7568, lng: 37.6153, label: "Фундамент", type: "structure", timestamp: new Date(Date.now() - 7200000) },
  { id: "4", lat: 55.7538, lng: 37.6183, label: "Точка отбора проб", type: "poi", timestamp: new Date(Date.now() - 10800000) },
];

const typeConfig = {
  artifact: { color: "status-ok", label: "Артефакт" },
  anomaly: { color: "status-ai", label: "Аномалия" },
  structure: { color: "status-info", label: "Структура" },
  poi: { color: "status-warning", label: "Точка интереса" },
};

export default function MapPage() {
  const [markers] = useState<MarkerData[]>(mockMarkers);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [mapStyle, setMapStyle] = useState<"satellite" | "terrain" | "standard">("satellite");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Карта</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Геолокация маркеров и зон исследования
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Добавить маркер</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="xl:col-span-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="science-card overflow-hidden"
          >
            {/* Map Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <MapIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Участок исследования</span>
                <div className="flex items-center gap-1.5 ml-2">
                  <div className="status-dot status-dot-ok" />
                  <span className="text-xs font-mono text-muted-foreground">GPS LOCK</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={mapStyle}
                  onChange={(e) => setMapStyle(e.target.value as typeof mapStyle)}
                  className="text-xs bg-muted border-none rounded px-2 py-1 text-muted-foreground"
                >
                  <option value="satellite">Спутник</option>
                  <option value="terrain">Рельеф</option>
                  <option value="standard">Стандарт</option>
                </select>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative aspect-[16/9] bg-surface-elevated">
              {/* Grid Pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                  `,
                  backgroundSize: "50px 50px",
                }}
              />

              {/* Simulated map markers */}
              <svg viewBox="0 0 800 450" className="absolute inset-0 w-full h-full">
                {/* Research area outline */}
                <path
                  d="M 200 150 L 600 120 L 650 350 L 180 380 Z"
                  fill="hsl(var(--primary) / 0.1)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                />

                {/* Markers */}
                {markers.map((marker, index) => {
                  const x = 300 + index * 80 + (Math.sin(index) * 50);
                  const y = 200 + index * 30;
                  const config = typeConfig[marker.type];
                  const isSelected = selectedMarker?.id === marker.id;

                  return (
                    <g key={marker.id} onClick={() => setSelectedMarker(marker)} style={{ cursor: "pointer" }}>
                      {/* Outer ring for selected */}
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r="20"
                          fill="none"
                          stroke={`hsl(var(--${config.color}))`}
                          strokeWidth="2"
                          opacity="0.5"
                        />
                      )}
                      {/* Pulse ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill={`hsl(var(--${config.color}) / 0.2)`}
                      />
                      {/* Main marker */}
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill={`hsl(var(--${config.color}))`}
                      />
                    </g>
                  );
                })}

                {/* Scale */}
                <g transform="translate(50, 400)">
                  <line x1="0" y1="0" x2="100" y2="0" stroke="hsl(var(--foreground))" strokeWidth="2" />
                  <line x1="0" y1="-5" x2="0" y2="5" stroke="hsl(var(--foreground))" strokeWidth="2" />
                  <line x1="100" y1="-5" x2="100" y2="5" stroke="hsl(var(--foreground))" strokeWidth="2" />
                  <text x="50" y="20" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">100м</text>
                </g>

                {/* Compass */}
                <g transform="translate(750, 50)">
                  <circle cx="0" cy="0" r="20" fill="hsl(var(--muted) / 0.5)" stroke="hsl(var(--border))" />
                  <text x="0" y="4" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="12" fontWeight="bold">N</text>
                </g>
              </svg>

              {/* Coordinates overlay */}
              <div className="absolute bottom-3 left-3 px-3 py-2 bg-black/60 rounded text-xs font-mono text-white/80">
                <div>N 55.7558° E 37.6173°</div>
                <div className="text-white/50 mt-0.5">Участок A-12 • Слой III</div>
              </div>

              {/* Map notice */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <MapIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground/50">
                  Добавьте Mapbox токен в настройках
                </p>
                <p className="text-xs text-muted-foreground/30 mt-1">
                  для полноценной интерактивной карты
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Markers List */}
        <div className="xl:col-span-1 space-y-4">
          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="science-card"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Легенда</span>
            </div>
            <div className="p-3 space-y-2">
              {Object.entries(typeConfig).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${value.color}`} />
                  <span className="text-xs text-muted-foreground">{value.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Markers List */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="science-card"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Маркеры ({markers.length})</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {markers.map((marker) => {
                const config = typeConfig[marker.type];
                const isSelected = selectedMarker?.id === marker.id;

                return (
                  <button
                    key={marker.id}
                    onClick={() => setSelectedMarker(marker)}
                    className={`w-full text-left p-3 border-b border-border last:border-b-0 transition-colors ${
                      isSelected ? "bg-muted" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 bg-${config.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{marker.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {config.label}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground/60">
                          <Clock className="w-3 h-3" />
                          {marker.timestamp.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Selected Marker Details */}
          {selectedMarker && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="science-card p-4"
            >
              <h4 className="text-sm font-medium mb-3">{selectedMarker.label}</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Широта</span>
                  <span className="font-mono">{selectedMarker.lat.toFixed(4)}°N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Долгота</span>
                  <span className="font-mono">{selectedMarker.lng.toFixed(4)}°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Тип</span>
                  <span className={`text-${typeConfig[selectedMarker.type].color}`}>
                    {typeConfig[selectedMarker.type].label}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
