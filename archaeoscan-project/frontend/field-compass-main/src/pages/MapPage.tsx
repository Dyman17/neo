import { useState } from 'react';
import { MapPin, Layers, Navigation, Target, Download } from 'lucide-react';

export default function MapPage() {
  const [activeLayer, setActiveLayer] = useState('terrain');

  // Simulated GPS position
  const position = {
    latitude: 40.7496,
    longitude: 14.4847,
    altitude: 42.3,
    accuracy: 2.5,
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Map</h1>
          <p className="text-sm text-muted-foreground">Geospatial positioning and overlays</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
            <Download className="w-4 h-4" />
            Export KML
          </button>
        </div>
      </div>

      {/* Layer selector */}
      <div className="flex items-center gap-2 card-instrument p-3">
        <Layers className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Layer:</span>
        {['terrain', 'satellite', 'magnetic', 'depth'].map((layer) => (
          <button
            key={layer}
            onClick={() => setActiveLayer(layer)}
            className={`px-3 py-1 text-xs uppercase tracking-wider rounded-md transition-colors ${
              activeLayer === layer
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="flex-1 card-instrument min-h-[400px] relative overflow-hidden">
        {/* Grid background simulating map */}
        <div className="absolute inset-0 grid-scientific opacity-50" />
        
        {/* Simulated map content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-primary/30 flex items-center justify-center mb-4 mx-auto relative">
              <div className="w-16 h-16 rounded-full border-2 border-primary/50 flex items-center justify-center animate-pulse">
                <div className="w-4 h-4 rounded-full bg-primary" />
              </div>
              {/* Accuracy ring */}
              <div className="absolute inset-0 rounded-full border border-status-info/30 animate-ping" />
            </div>
            <div className="font-mono-data text-sm text-muted-foreground">
              GPS Active
            </div>
          </div>
        </div>

        {/* Trail points */}
        {[
          { x: '30%', y: '40%' },
          { x: '35%', y: '45%' },
          { x: '42%', y: '48%' },
          { x: '48%', y: '50%' },
        ].map((point, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/50"
            style={{ left: point.x, top: point.y }}
          />
        ))}

        {/* Waypoint markers */}
        {[
          { x: '25%', y: '30%', label: 'WP-1' },
          { x: '70%', y: '60%', label: 'WP-2' },
          { x: '60%', y: '25%', label: 'WP-3' },
        ].map((wp) => (
          <div
            key={wp.label}
            className="absolute flex flex-col items-center"
            style={{ left: wp.x, top: wp.y, transform: 'translate(-50%, -100%)' }}
          >
            <span className="text-xs font-mono-data text-status-warning mb-1">{wp.label}</span>
            <MapPin className="w-5 h-5 text-status-warning" />
          </div>
        ))}

        {/* Compass */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full border border-border bg-background/80 flex items-center justify-center">
          <Navigation className="w-6 h-6 text-primary transform -rotate-45" />
        </div>

        {/* Scale bar */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="h-1 w-24 bg-foreground rounded-full" />
          <span className="font-mono-data text-xs text-muted-foreground">50m</span>
        </div>
      </div>

      {/* Position info */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card-instrument p-3">
          <div className="text-xs text-muted-foreground mb-1">Latitude</div>
          <div className="font-mono-data text-lg text-foreground">
            {position.latitude.toFixed(6)}°
          </div>
        </div>
        <div className="card-instrument p-3">
          <div className="text-xs text-muted-foreground mb-1">Longitude</div>
          <div className="font-mono-data text-lg text-foreground">
            {position.longitude.toFixed(6)}°
          </div>
        </div>
        <div className="card-instrument p-3">
          <div className="text-xs text-muted-foreground mb-1">Altitude</div>
          <div className="font-mono-data text-lg text-foreground">
            {position.altitude.toFixed(1)}m
          </div>
        </div>
        <div className="card-instrument p-3">
          <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
          <div className="font-mono-data text-lg text-status-success">
            ±{position.accuracy.toFixed(1)}m
          </div>
        </div>
      </div>
    </div>
  );
}
