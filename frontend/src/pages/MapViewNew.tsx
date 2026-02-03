import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useArtifacts, useArtifactWebSocket } from '@/hooks/useArtifacts';
import { Artifact } from '@/types/api';
import {
  Map,
  Layers,
  MapPin,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Download,
  Wifi,
  WifiOff,
  RefreshCw,
  Activity,
  Camera,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export function MapViewNew() {
  const { 
    artifacts, 
    isLoading, 
    error, 
    refetch,
    saveArtifact,
    analyzePreservation,
    isSaving,
    isAnalyzing 
  } = useArtifacts();
  
  const { isConnected } = useArtifactWebSocket();
  
  // Map state
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState([70]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState({ lat: 51.5074, lng: -0.1278 });
  
  const mapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Filter artifacts by type
  const [filterType, setFilterType] = useState<string>('all');
  
  const filteredArtifacts = artifacts.filter(artifact => 
    filterType === 'all' || artifact.type === filterType
  );

  // Draw map on canvas
  useEffect(() => {
    if (!canvasRef.current || !filteredArtifacts.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      const gridSize = 50 * mapZoom;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw heatmap
    if (showHeatmap && filteredArtifacts.length > 0) {
      filteredArtifacts.forEach(artifact => {
        const x = ((artifact.lng - mapCenter.lng) * 10000 * mapZoom) + canvas.width / 2;
        const y = canvas.height / 2 - ((artifact.lat - mapCenter.lat) * 10000 * mapZoom);
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30 * mapZoom);
        gradient.addColorStop(0, `rgba(239, 68, 68, ${heatmapOpacity[0] / 100})`);
        gradient.addColorStop(0.5, `rgba(245, 158, 11, ${heatmapOpacity[0] / 200})`);
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 30 * mapZoom, y - 30 * mapZoom, 60 * mapZoom, 60 * mapZoom);
      });
    }

    // Draw markers
    if (showMarkers) {
      filteredArtifacts.forEach(artifact => {
        const x = ((artifact.lng - mapCenter.lng) * 10000 * mapZoom) + canvas.width / 2;
        const y = canvas.height / 2 - ((artifact.lat - mapCenter.lat) * 10000 * mapZoom);
        
        // Marker color by type
        const colors = {
          artifact: '#eab308',
          structure: '#3b82f6', 
          anomaly: '#ef4444',
          organic: '#22c55e'
        };
        
        const color = colors[artifact.type as keyof typeof colors] || '#6b7280';
        
        // Draw marker
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 8 * mapZoom, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw confidence ring
        if (artifact.confidence > 0) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = artifact.confidence;
          ctx.beginPath();
          ctx.arc(x, y, (8 + artifact.confidence * 10) * mapZoom, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        
        // Draw label
        ctx.fillStyle = '#1f2937';
        ctx.font = `${12 * mapZoom}px sans-serif`;
        ctx.fillText(artifact.type, x + 12 * mapZoom, y - 8 * mapZoom);
      });
    }
  }, [filteredArtifacts, showHeatmap, showMarkers, showGrid, heatmapOpacity, mapZoom, mapCenter]);

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if click is on any artifact
    const clickedArtifact = filteredArtifacts.find(artifact => {
      const artifactX = ((artifact.lng - mapCenter.lng) * 10000 * mapZoom) + canvasRef.current!.width / 2;
      const artifactY = canvasRef.current!.height / 2 - ((artifact.lat - mapCenter.lat) * 10000 * mapZoom);
      
      const distance = Math.sqrt(Math.pow(x - artifactX, 2) + Math.pow(y - artifactY, 2));
      return distance <= 15 * mapZoom;
    });
    
    setSelectedArtifact(clickedArtifact || null);
  };

  // Handle zoom
  const handleZoomIn = () => setMapZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setMapZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleResetView = () => {
    setMapZoom(1);
    setMapCenter({ lat: 51.5074, lng: -0.1278 });
  };

  // Simulate new artifact detection
  const simulateNewArtifact = async () => {
    const newArtifact: Omit<Artifact, 'id' | 'timestamp'> = {
      lat: mapCenter.lat + (Math.random() - 0.5) * 0.01,
      lng: mapCenter.lng + (Math.random() - 0.5) * 0.01,
      type: ['artifact', 'structure', 'anomaly', 'organic'][Math.floor(Math.random() * 4)] as Artifact['type'],
      material: ['ceramic', 'metal', 'stone', 'organic'][Math.floor(Math.random() * 4)],
      confidence: Math.random() * 100,
      depth: Math.random() * 10,
      description: 'Detected by drone sensors'
    };
    
    try {
      await saveArtifact(newArtifact);
    } catch (error) {
      console.error('Failed to save artifact:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Map className="w-6 h-6" />
          <h1 className="text-2xl font-semibold">Archaeological Map</h1>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? (
              <><Wifi className="w-3 h-3 mr-1" />Live</>
            ) : (
              <><WifiOff className="w-3 h-3 mr-1" />Offline</>
            )}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={simulateNewArtifact} disabled={isSaving}>
            <Activity className="w-4 h-4 mr-2" />
            Simulate Detection
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Artifacts</p>
                <p className="text-2xl font-bold">{artifacts.length}</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Artifacts</p>
                <p className="text-2xl font-bold">{artifacts.filter(a => a.type === 'artifact').length}</p>
              </div>
              <MapPin className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Structures</p>
                <p className="text-2xl font-bold">{artifacts.filter(a => a.type === 'structure').length}</p>
              </div>
              <Layers className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Anomalies</p>
                <p className="text-2xl font-bold">{artifacts.filter(a => a.type === 'anomaly').length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Interactive Map</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-mono">{Math.round(mapZoom * 100)}%</span>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleResetView}>
                  <Crosshair className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full h-96 border rounded-lg cursor-crosshair"
                onClick={handleCanvasClick}
              />
              
              {error && (
                <Alert className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load artifacts: {error.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Map Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filter */}
            <div className="space-y-2">
              <Label>Filter by Type</Label>
              <select 
                className="w-full p-2 border rounded"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="artifact">Artifacts</option>
                <option value="structure">Structures</option>
                <option value="anomaly">Anomalies</option>
                <option value="organic">Organic</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show Markers</Label>
                <Switch checked={showMarkers} onCheckedChange={setShowMarkers} />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show Heatmap</Label>
                <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show Grid</Label>
                <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              </div>
            </div>

            {/* Heatmap Opacity */}
            {showHeatmap && (
              <div className="space-y-2">
                <Label>Heatmap Opacity: {heatmapOpacity[0]}%</Label>
                <Slider
                  value={heatmapOpacity}
                  onValueChange={setHeatmapOpacity}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>
            )}

            {/* Export */}
            <Button variant="outline" className="w-full" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Map
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Selected Artifact Details */}
      {selectedArtifact && (
        <Card>
          <CardHeader>
            <CardTitle>Artifact Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Type</Label>
                <p className="font-medium">{selectedArtifact.type}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Material</Label>
                <p className="font-medium">{selectedArtifact.material || 'Unknown'}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Confidence</Label>
                <p className="font-medium">{selectedArtifact.confidence.toFixed(1)}%</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Location</Label>
                <p className="font-medium">
                  {selectedArtifact.lat.toFixed(6)}, {selectedArtifact.lng.toFixed(6)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Depth</Label>
                <p className="font-medium">{selectedArtifact.depth?.toFixed(2)}m</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Preservation Index</Label>
                <p className="font-medium">
                  {selectedArtifact.preservation_index?.toFixed(1) || 'Not analyzed'}
                </p>
              </div>
            </div>
            
            {selectedArtifact.description && (
              <div className="mt-4">
                <Label className="text-sm text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedArtifact.description}</p>
              </div>
            )}
            
            <div className="mt-4 flex gap-2">
              <Button 
                size="sm" 
                onClick={() => analyzePreservation(selectedArtifact.id)}
                disabled={isAnalyzing}
              >
                <Activity className="w-4 h-4 mr-2" />
                Analyze Preservation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MapViewNew;
