import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import apiService from '@/services/api';
import { VideoRecording, AppSettings } from '@/types/api';
import {
  Camera,
  CameraOff,
  Circle,
  Square,
  Download,
  Trash2,
  RefreshCw,
  Wifi,
  WifiOff,
  Settings,
  Play,
  Pause,
  Video,
  VideoOff,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export function CameraStreamNew() {
  const [settings, setSettings] = useState<AppSettings>({
    esp_cam_url: 'http://192.168.1.77',
    ws_url: 'ws://localhost:8000/ws',
    map_refresh_rate: 1000,
    video_recording: false,
    auto_save_artifacts: true,
    gps_enabled: true,
    sensor_sensitivity: 75,
  });
  
  const [recordings, setRecordings] = useState<VideoRecording[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [espStatus, setEspStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [streamUrl, setStreamUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Load settings and recordings on mount
  useEffect(() => {
    loadSettings();
    loadRecordings();
    checkEspStatus();
  }, []);

  // Update stream URL when ESP URL changes
  useEffect(() => {
    setStreamUrl(`${settings.esp_cam_url}/stream`);
  }, [settings.esp_cam_url]);

  // Recording timer
  useEffect(() => {
    if (isRecording && currentRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }
    
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording, currentRecording]);

  const loadSettings = async () => {
    try {
      const loadedSettings = await apiService.getSettings();
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadRecordings = async () => {
    try {
      const recordingsList = await apiService.getRecordings();
      setRecordings(recordingsList);
    } catch (error) {
      console.error('Failed to load recordings:', error);
    }
  };

  const checkEspStatus = async () => {
    setEspStatus('checking');
    try {
      const isOnline = await apiService.checkEspCam(settings.esp_cam_url);
      setEspStatus(isOnline ? 'online' : 'offline');
    } catch (error) {
      setEspStatus('offline');
    }
  };

  const startRecording = async () => {
    if (!settings.esp_cam_url) {
      alert('Please configure ESP32-CAM URL in settings');
      return;
    }

    setIsLoading(true);
    try {
      const recording = await apiService.startRecording();
      setCurrentRecording(recording.recording_id);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording');
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = async () => {
    if (!currentRecording) return;

    setIsLoading(true);
    try {
      const recording = await apiService.stopRecording(currentRecording);
      setRecordings(prev => [recording, ...prev]);
      setCurrentRecording(null);
      setIsRecording(false);
      setRecordingTime(0);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      alert('Failed to stop recording');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadRecording = (recording: VideoRecording) => {
    const link = document.createElement('a');
    link.href = `${settings.esp_cam_url}/recordings/${recording.filename}`;
    link.download = recording.filename;
    link.click();
  };

  const deleteRecording = async (recordingId: string) => {
    if (!confirm('Are you sure you want to delete this recording?')) return;
    
    try {
      // This would be an API call to delete the recording
      // await apiService.deleteRecording(recordingId);
      setRecordings(prev => prev.filter(r => r.id !== recordingId));
    } catch (error) {
      console.error('Failed to delete recording:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6" />
          <h1 className="text-2xl font-semibold">Camera Stream & Recording</h1>
          <Badge variant={espStatus === 'online' ? "default" : "destructive"}>
            {espStatus === 'online' ? (
              <><Wifi className="w-3 h-3 mr-1" />Connected</>
            ) : espStatus === 'checking' ? (
              <><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Checking</>
            ) : (
              <><WifiOff className="w-3 h-3 mr-1" />Offline</>
            )}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={checkEspStatus}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Connection
          </Button>
        </div>
      </div>

      {/* Camera Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Stream</span>
                <div className="flex items-center gap-2">
                  {isRecording && (
                    <Badge variant="destructive" className="animate-pulse">
                      <Circle className="w-3 h-3 mr-1 fill-current" />
                      REC {formatTime(recordingTime)}
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {espStatus === 'online' ? (
                  <img
                    src={streamUrl}
                    alt="ESP32-CAM Stream"
                    className="w-full h-96 bg-black rounded-lg object-contain"
                    onError={(e) => {
                      setEspStatus('offline');
                    }}
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <CameraOff className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400">
                        {espStatus === 'checking' ? 'Connecting...' : 'Camera Offline'}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {settings.esp_cam_url}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Recording overlay */}
                {isRecording && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
                      <Circle className="w-3 h-3 fill-current animate-pulse" />
                      <span className="text-sm font-medium">Recording</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Recording Controls */}
              <div className="flex items-center justify-center gap-4 mt-4">
                {!isRecording ? (
                  <Button 
                    onClick={startRecording}
                    disabled={espStatus !== 'online' || isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Circle className="w-4 h-4 mr-2 fill-current" />
                    Start Recording
                  </Button>
                ) : (
                  <Button 
                    onClick={stopRecording}
                    disabled={isLoading}
                    variant="destructive"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop Recording
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={() => window.open(streamUrl, '_blank')}
                  disabled={espStatus !== 'online'}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Camera Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="esp_url">ESP32-CAM URL</Label>
                <Input
                  id="esp_url"
                  value={settings.esp_cam_url}
                  onChange={(e) => setSettings(prev => ({ ...prev, esp_cam_url: e.target.value }))}
                  placeholder="http://192.168.1.77"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-record on detection</Label>
                  <p className="text-xs text-muted-foreground">
                    Start recording when artifacts are detected
                  </p>
                </div>
                <Switch 
                  checked={settings.video_recording}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, video_recording: checked }))}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={checkEspStatus}
                disabled={espStatus === 'checking'}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${espStatus === 'checking' ? 'animate-spin' : ''}`} />
                Test Connection
              </Button>
            </CardContent>
          </Card>

          {/* Recording Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Recording Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Recordings</span>
                <span className="font-medium">{recordings.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <span className="font-medium">
                  {formatFileSize(recordings.reduce((sum, r) => sum + r.size, 0))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Session</span>
                <span className="font-medium">{formatTime(recordingTime)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recordings List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recordings</span>
            <Button variant="outline" size="sm" onClick={loadRecordings}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recordings.length === 0 ? (
            <div className="text-center py-8">
              <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No recordings found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start recording to see them here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Artifacts</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recordings.map((recording) => (
                    <TableRow key={recording.id}>
                      <TableCell className="font-medium">{recording.filename}</TableCell>
                      <TableCell>
                        {new Date(recording.start_time).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {recording.duration ? formatTime(recording.duration) : 'In progress'}
                      </TableCell>
                      <TableCell>{formatFileSize(recording.size)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {recording.artifacts_detected.length}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => downloadRecording(recording)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteRecording(recording.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Messages */}
      {espStatus === 'offline' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Camera is offline. Please check the ESP32-CAM URL and ensure the device is connected to the network.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default CameraStreamNew;
