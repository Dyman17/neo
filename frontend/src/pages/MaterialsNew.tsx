import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useArtifacts } from '@/hooks/useArtifacts';
import { Artifact } from '@/types/api';
import {
  Package,
  Search,
  Filter,
  Download,
  RefreshCw,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export function MaterialsNew() {
  const { artifacts, isLoading, error, refetch, analyzePreservation, isAnalyzing } = useArtifacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');

  // Filter artifacts
  const filteredArtifacts = artifacts.filter(artifact => {
    const matchesSearch = artifact.material?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artifact.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artifact.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || artifact.type === filterType;
    const matchesMaterial = filterMaterial === 'all' || artifact.material === filterMaterial;
    
    return matchesSearch && matchesType && matchesMaterial;
  });

  // Get unique materials for filter
  const uniqueMaterials = Array.from(new Set(artifacts.map(a => a.material).filter(Boolean)));

  // Material types with descriptions
  const materialTypes = [
    { type: 'artifact', name: 'Artifacts', description: 'Man-made objects, tools, pottery', color: 'bg-yellow-100 text-yellow-800' },
    { type: 'structure', name: 'Structures', description: 'Buildings, foundations, walls', color: 'bg-blue-100 text-blue-800' },
    { type: 'anomaly', name: 'Anomalies', description: 'Unusual readings, metal detections', color: 'bg-red-100 text-red-800' },
    { type: 'organic', name: 'Organic', description: 'Biological remains, bones, wood', color: 'bg-green-100 text-green-800' }
  ];

  // Analyze all artifacts
  const analyzeAllArtifacts = async () => {
    for (const artifact of artifacts) {
      if (!artifact.preservation_index) {
        try {
          await analyzePreservation(artifact.id);
        } catch (error) {
          console.error(`Failed to analyze artifact ${artifact.id}:`, error);
        }
      }
    }
  };

  // Export data
  const exportData = () => {
    const csv = [
      ['ID', 'Type', 'Material', 'Location', 'Confidence', 'Depth', 'Preservation Index', 'Date'].join(','),
      ...filteredArtifacts.map(artifact => [
        artifact.id,
        artifact.type,
        artifact.material || 'Unknown',
        `${artifact.lat.toFixed(6)}, ${artifact.lng.toFixed(6)}`,
        artifact.confidence.toFixed(1),
        artifact.depth?.toFixed(2) || 'N/A',
        artifact.preservation_index?.toFixed(1) || 'Not analyzed',
        new Date(artifact.timestamp).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artifacts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6" />
          <h1 className="text-2xl font-semibold">Materials & Artifacts</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Material Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {materialTypes.map(({ type, name, description, color }) => {
          const count = artifacts.filter(a => a.type === type).length;
          return (
            <Card key={type}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={color}>{name}</Badge>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Type</Label>
              <select 
                className="w-full p-2 border rounded"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {materialTypes.map(({ type, name }) => (
                  <option key={type} value={type}>{name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Material</Label>
              <select 
                className="w-full p-2 border rounded"
                value={filterMaterial}
                onChange={(e) => setFilterMaterial(e.target.value)}
              >
                <option value="all">All Materials</option>
                {uniqueMaterials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={analyzeAllArtifacts}
                disabled={isAnalyzing || artifacts.length === 0}
              >
                <Activity className="w-4 h-4 mr-2" />
                Analyze All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredArtifacts.length} of {artifacts.length} artifacts
        </p>
        {error && (
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load artifacts: {error.message}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Artifacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Artifact Database</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredArtifacts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all' || filterMaterial !== 'all' 
                  ? 'No artifacts match your filters' 
                  : 'No artifacts found'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Depth (m)</TableHead>
                    <TableHead>Preservation</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArtifacts.map((artifact) => (
                    <TableRow key={artifact.id}>
                      <TableCell className="font-mono text-xs">
                        {artifact.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {artifact.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{artifact.material || 'Unknown'}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {artifact.lat.toFixed(4)}, {artifact.lng.toFixed(4)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${artifact.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs">{artifact.confidence.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{artifact.depth?.toFixed(2) || 'N/A'}</TableCell>
                      <TableCell>
                        {artifact.preservation_index ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{artifact.preservation_index.toFixed(1)}</span>
                          </div>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => analyzePreservation(artifact.id)}
                            disabled={isAnalyzing}
                          >
                            Analyze
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(artifact.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MaterialsNew;
