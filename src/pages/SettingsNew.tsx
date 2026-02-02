import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import apiService from '@/services/api';
import { AppSettings, HealthCheckResponse } from '@/types/api';
import {
  Settings as SettingsIcon,
  Wifi,
  WifiOff,
  Database,
  HardDrive,
  Camera,
  CameraOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Save,
  Globe,
  MapPin,
  Activity
} from 'lucide-react';

export function SettingsNew() {
  const [settings, setSettings] = useState<AppSettings>({
    esp_cam_url: 'http://192.168.1.77',
    ws_url: 'ws://localhost:8000/ws',
    map_refresh_rate: 1000,
    video_recording: false,
    auto_save_artifacts: true,
    gps_enabled: true,
    sensor_sensitivity: 75,
  });

  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [espStatus, setEspStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Load settings on mount
  useEffect(() => {
    loadSettings();
    checkHealth();
    checkEspStatus();
  }, []);

  const loadSettings = async () => {
    try {
      const loadedSettings = await apiService.getSettings();
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const checkHealth = async () => {
    try {
      const health = await apiService.healthCheck();
      setHealthStatus(health);
    } catch (error) {
      setHealthStatus({
        status: 'error',
        timestamp: Date.now(),
        message: 'Backend unavailable'
      });
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

  const saveSettings = async () => {
    setSaving(true);
    try {
      const savedSettings = await apiService.saveSettings(settings);
      setSettings(savedSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: 'ok' | 'error' | 'warning') => {
    const variants = {
      ok: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status === 'ok' ? 'Online' : status === 'error' ? 'Offline' : 'Warning'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">Backend</span>
              </div>
              <div className="flex items-center gap-2">
                {healthStatus && getStatusIcon(healthStatus.status === 'ok')}
                {healthStatus && getStatusBadge(healthStatus.status)}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">WebSocket</span>
              </div>
              <div className="flex items-center gap-2">
                {healthStatus && getStatusIcon(healthStatus.ws || false)}
                {healthStatus && getStatusBadge(healthStatus.ws ? 'ok' : 'error')}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">ESP32-CAM</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(espStatus === 'online')}
                {getStatusBadge(espStatus === 'online' ? 'ok' : 'error')}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkHealth}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Check Connection
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkEspStatus}
              disabled={espStatus === 'checking'}
            >
              <Camera className={`w-4 h-4 mr-2 ${espStatus === 'checking' ? 'animate-pulse' : ''}`} />
              Check ESP32
            </Button>
          </div>

          {healthStatus && healthStatus.status !== 'ok' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {healthStatus.message || 'Some services are unavailable'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* ESP32-CAM Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            ESP32-CAM Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="esp_cam_url">ESP32-CAM URL</Label>
            <div className="flex gap-2">
              <Input
                id="esp_cam_url"
                value={settings.esp_cam_url}
                onChange={(e) => updateSetting('esp_cam_url', e.target.value)}
                placeholder="http://192.168.1.77"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={checkEspStatus}
                disabled={espStatus === 'checking'}
              >
                Test
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the IP address or URL of your ESP32-CAM device
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Video Recording</Label>
              <p className="text-xs text-muted-foreground">
                Enable video recording from ESP32-CAM
              </p>
            </div>
            <Switch
              checked={settings.video_recording}
              onCheckedChange={(checked) => updateSetting('video_recording', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Map Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Map & GPS Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ws_url">WebSocket URL</Label>
            <Input
              id="ws_url"
              value={settings.ws_url}
              onChange={(e) => updateSetting('ws_url', e.target.value)}
              placeholder="ws://localhost:8000/ws"
            />
            <p className="text-xs text-muted-foreground">
              WebSocket endpoint for real-time data
            </p>
          </div>

          <div className="space-y-2">
            <Label>Map Refresh Rate: {settings.map_refresh_rate}ms</Label>
            <Slider
              value={[settings.map_refresh_rate]}
              onValueChange={([value]) => updateSetting('map_refresh_rate', value)}
              min={500}
              max={5000}
              step={100}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              How often to refresh map data
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>GPS Enabled</Label>
              <p className="text-xs text-muted-foreground">
                Use GPS for artifact positioning
              </p>
            </div>
            <Switch
              checked={settings.gps_enabled}
              onCheckedChange={(checked) => updateSetting('gps_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-save Artifacts</Label>
              <p className="text-xs text-muted-foreground">
                Automatically save detected artifacts
              </p>
            </div>
            <Switch
              checked={settings.auto_save_artifacts}
              onCheckedChange={(checked) => updateSetting('auto_save_artifacts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sensor Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Sensor Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Sensor Sensitivity: {settings.sensor_sensitivity}%</Label>
            <Slider
              value={[settings.sensor_sensitivity]}
              onValueChange={([value]) => updateSetting('sensor_sensitivity', value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Adjust sensor detection sensitivity
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={saveSettings}
          disabled={saving}
          className="min-w-32"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}

export default SettingsNew;
