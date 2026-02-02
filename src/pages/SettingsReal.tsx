import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { apiService } from '@/services/api';
import {
  Server,
  Wifi,
  Camera,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  Settings,
  Activity,
  Link,
  Unlink
} from 'lucide-react';

export const SettingsReal = () => {
  const { health, websocket, esp32, actions } = useSystemStatus();
  const [esp32Url, setEsp32Url] = useState(esp32.url);

  useEffect(() => {
    setEsp32Url(esp32.url);
  }, [esp32.url]);

  const handleESP32UrlChange = (url: string) => {
    setEsp32Url(url);
    actions.updateESP32Url(url);
  };

  const handleESP32Ping = () => {
    actions.pingESP32(esp32Url);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'ok':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (connected: boolean, loading?: boolean) => {
    if (loading) {
      return <Badge variant="outline">Checking...</Badge>;
    }
    
    if (connected) {
      return <Badge variant="default">Connected</Badge>;
    }
    
    return <Badge variant="destructive">Disconnected</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">System Settings</h1>
        <Badge variant="outline">Real-time Status</Badge>
      </div>

      {/* Backend Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Backend Status
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={actions.checkHealth}
              disabled={health.status === 'loading'}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(health.status)}
                <div>
                  <p className="font-medium">
                    Status: <span className={
                      health.status === 'healthy' ? 'text-green-600' : 
                      health.status === 'error' ? 'text-red-600' : 
                      'text-blue-600'
                    }>
                      {health.status.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last checked: {formatTimestamp(health.timestamp)}
                  </p>
                </div>
              </div>
              {getStatusBadge(health.status === 'healthy', health.status === 'loading')}
            </div>

            {/* Services Status */}
            {health.services && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Activity className="w-4 h-4" />
                  <div>
                    <p className="text-sm font-medium">API</p>
                    <p className="text-xs text-muted-foreground">{health.services.api}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Wifi className="w-4 h-4" />
                  <div>
                    <p className="text-sm font-medium">WebSocket</p>
                    <p className="text-xs text-muted-foreground">{health.services.websocket}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Server className="w-4 h-4" />
                  <div>
                    <p className="text-sm font-medium">Database</p>
                    <p className="text-xs text-muted-foreground">{health.services.database}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {health.message && health.status === 'error' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{health.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* WebSocket Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              WebSocket Connection
            </div>
            <div className="flex items-center gap-2">
              {websocket.connected ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={actions.disconnectWebSocket}
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={actions.reconnectWebSocket}
                  disabled={websocket.connecting}
                >
                  <Link className="w-4 h-4 mr-2" />
                  {websocket.connecting ? 'Connecting...' : 'Reconnect'}
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {websocket.connected ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : websocket.connecting ? (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                ) : (
                  <Wifi className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium">
                    {websocket.connected ? 'Connected' : websocket.connecting ? 'Connecting...' : 'Disconnected'}
                  </p>
                  {websocket.reconnectAttempts > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Reconnect attempts: {websocket.reconnectAttempts}
                    </p>
                  )}
                </div>
              </div>
              {getStatusBadge(websocket.connected, websocket.connecting)}
            </div>

            {websocket.error && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{websocket.error}</AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-muted-foreground">
              <p>WebSocket URL: {apiService.getWebSocketUrl()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESP32-CAM Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              ESP32-CAM
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleESP32Ping}
              disabled={esp32.loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Ping
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* URL Configuration */}
            <div className="space-y-2">
              <Label htmlFor="esp32-url">ESP32-CAM URL</Label>
              <div className="flex gap-2">
                <Input
                  id="esp32-url"
                  value={esp32Url}
                  onChange={(e) => handleESP32UrlChange(e.target.value)}
                  placeholder="http://192.168.1.77"
                />
                <Button 
                  variant="outline"
                  onClick={handleESP32Ping}
                  disabled={esp32.loading}
                >
                  {esp32.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {esp32.connected ? (
                  <Camera className="w-5 h-5 text-green-500" />
                ) : esp32.loading ? (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium">
                    {esp32.connected ? 'Connected' : esp32.loading ? 'Checking...' : 'Disconnected'}
                  </p>
                  {esp32.lastPing && (
                    <p className="text-sm text-muted-foreground">
                      Last ping: {formatTimestamp(esp32.lastPing)}
                    </p>
                  )}
                </div>
              </div>
              {getStatusBadge(esp32.connected, esp32.loading)}
            </div>

            {esp32.error && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{esp32.error}</AlertDescription>
              </Alert>
            )}

            {/* Additional Info */}
            <div className="text-sm text-muted-foreground">
              <p>Make sure ESP32-CAM is on the same network and accessible.</p>
              <p>Default IP: http://192.168.1.77</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Backend URL</p>
              <p className="text-muted-foreground">https://huggingface.co/spaces/Dyman17/archaeoscan-ws</p>
            </div>
            <div>
              <p className="font-medium">WebSocket URL</p>
              <p className="text-muted-foreground">wss://huggingface.co/spaces/Dyman17/archaeoscan-ws/ws</p>
            </div>
            <div>
              <p className="font-medium">Health Check Interval</p>
              <p className="text-muted-foreground">30 seconds</p>
            </div>
            <div>
              <p className="font-medium">Auto-reconnect</p>
              <p className="text-muted-foreground">Enabled (2s delay)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
