import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useArtifacts } from '@/hooks/useArtifacts';
import { Artifact } from '@/types/api';
import type { PreservationAnalysis } from '@/types/api';
import aiService from '@/services/aiService';
import {
  Brain,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Target,
  Lightbulb,
  Zap
} from 'lucide-react';

export function PreservationAnalysis() {
  const { artifacts, isLoading, analyzePreservation, isAnalyzing } = useArtifacts();
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [analysis, setAnalysis] = useState<PreservationAnalysis | null>(null);
  const [materialComparison, setMaterialComparison] = useState<{
    materials: Array<{ name: string; count: number; avgPreservation: number }>;
    insights: string[];
  } | null>(null);
  const [aiStatus, setAiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkAIStatus();
    loadMaterialComparison();
  }, [artifacts]);

  const checkAIStatus = async () => {
    setAiStatus('checking');
    try {
      const isOnline = await aiService.testConnection();
      setAiStatus(isOnline ? 'online' : 'offline');
    } catch (error) {
      setAiStatus('offline');
    }
  };

  const loadMaterialComparison = async () => {
    if (artifacts.length === 0) return;
    
    try {
      const comparison = await aiService.generateMaterialComparison(artifacts);
      setMaterialComparison(comparison);
    } catch (error) {
      console.error('Failed to load material comparison:', error);
    }
  };

  const handleAnalyzeArtifact = async (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setAnalysis(null);
    
    try {
      const result = await analyzePreservation(artifact.id);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const artifactsWithoutAnalysis = artifacts.filter(a => !a.preservation_index);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6" />
          <h1 className="text-2xl font-semibold">AI Preservation Analysis</h1>
          <Badge variant={aiStatus === 'online' ? "default" : "destructive"}>
            {aiStatus === 'online' ? (
              <><CheckCircle className="w-3 h-3 mr-1" />AI Online</>
            ) : aiStatus === 'checking' ? (
              <><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Checking</>
            ) : (
              <><AlertTriangle className="w-3 h-3 mr-1" />AI Offline</>
            )}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={checkAIStatus}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Check AI
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadMaterialComparison}
            disabled={artifacts.length === 0}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Artifacts</p>
                <p className="text-2xl font-bold">{artifacts.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Analyzed</p>
                <p className="text-2xl font-bold">{artifacts.filter(a => a.preservation_index).length}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Analysis</p>
                <p className="text-2xl font-bold">{artifactsWithoutAnalysis.length}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Preservation</p>
                <p className="text-2xl font-bold">
                  {artifacts.filter(a => a.preservation_index).length > 0
                    ? (artifacts.filter(a => a.preservation_index).reduce((sum, a) => sum + (a.preservation_index || 0), 0) / artifacts.filter(a => a.preservation_index).length).toFixed(1)
                    : '0'}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Material Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Material Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            {materialComparison ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {materialComparison.materials.map((material, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{material.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {material.count} items • {material.avgPreservation.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={material.avgPreservation} className="h-2" />
                    </div>
                  ))}
                </div>
                
                {materialComparison.insights.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      AI Insights
                    </h4>
                    <div className="space-y-1">
                      {materialComparison.insights.map((insight, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          • {insight}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No material data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Current Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedArtifact && analysis ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedArtifact.type}</p>
                    <p className="text-sm text-muted-foreground">{selectedArtifact.material || 'Unknown material'}</p>
                  </div>
                  <Badge className={getRiskColor(analysis.risk)}>
                    {analysis.risk.toUpperCase()} RISK
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Preservation Score</span>
                    <span className={`font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}/100
                    </span>
                  </div>
                  <Progress value={analysis.score} className="h-3" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Material Comparison</h4>
                  <div className="space-y-1">
                    {analysis.comparison.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{item.material}</span>
                        <span className={getScoreColor(item.preservation)}>
                          {item.preservation}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Recommendations</h4>
                  <div className="space-y-1">
                    {analysis.recommendations.map((rec, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        • {rec}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select an artifact to analyze
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Artifacts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Artifacts</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                artifactsWithoutAnalysis.slice(0, 3).forEach(artifact => {
                  handleAnalyzeArtifact(artifact);
                });
              }}
              disabled={isAnalyzing || artifactsWithoutAnalysis.length === 0}
            >
              <Zap className="w-4 h-4 mr-2" />
              Analyze Top 3
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {artifacts.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No artifacts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Preservation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artifacts.map((artifact) => (
                    <TableRow key={artifact.id}>
                      <TableCell>
                        <Badge variant="outline">{artifact.type}</Badge>
                      </TableCell>
                      <TableCell>{artifact.material || 'Unknown'}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {artifact.lat.toFixed(4)}, {artifact.lng.toFixed(4)}
                      </TableCell>
                      <TableCell>{artifact.confidence.toFixed(1)}%</TableCell>
                      <TableCell>
                        {artifact.preservation_index ? (
                          <span className={getScoreColor(artifact.preservation_index)}>
                            {artifact.preservation_index.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Not analyzed</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {artifact.preservation_index ? (
                          <Badge variant="default">Analyzed</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAnalyzeArtifact(artifact)}
                          disabled={isAnalyzing}
                        >
                          <Brain className="w-4 h-4" />
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

      {/* AI Status Alert */}
      {aiStatus === 'offline' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            AI service is offline. Please check your Groq API key and internet connection.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default PreservationAnalysis;
