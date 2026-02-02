import { SystemStatus, ProjectInfo } from '@/types/sensors';
import { Wifi, WifiOff, AlertTriangle, Battery, Clock } from 'lucide-react';

interface TopBarProps {
  project: ProjectInfo;
  systemStatus: SystemStatus;
}

export function TopBar({ project, systemStatus }: TopBarProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatTimestamp = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 1) return 'now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  const getConnectionIcon = () => {
    switch (systemStatus.connection) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-status-success" />;
      case 'reconnecting':
        return <Wifi className="w-4 h-4 text-status-warning animate-pulse" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-status-error" />;
    }
  };

  const getConnectionLabel = () => {
    switch (systemStatus.connection) {
      case 'connected':
        return 'Connected';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'offline':
        return 'Offline';
    }
  };

  const getBatteryColor = () => {
    if (systemStatus.battery < 10) return 'text-status-error';
    if (systemStatus.battery < 20) return 'text-status-warning';
    return 'text-status-success';
  };

  const criticalAlerts = systemStatus.alerts.filter((a) => a.type === 'error' && !a.acknowledged);

  return (
    <header className="h-12 bg-background-elevated border-b border-border flex items-center justify-between px-4">
      {/* Left: Project info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">AS</span>
          </div>
          <span className="font-medium text-foreground">{project.name}</span>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:block">{project.location}</span>
      </div>

      {/* Right: System status */}
      <div className="flex items-center gap-1">
        {/* Connection */}
        <div className="topbar-segment border-r border-border">
          <div className={`connection-dot ${
            systemStatus.connection === 'connected' ? 'connection-dot-online' :
            systemStatus.connection === 'reconnecting' ? 'connection-dot-reconnecting' :
            'connection-dot-offline'
          }`} />
          {getConnectionIcon()}
          <span className="text-xs text-muted-foreground hidden md:block">{getConnectionLabel()}</span>
        </div>

        {/* Battery */}
        <div className="topbar-segment border-r border-border">
          <Battery className={`w-4 h-4 ${getBatteryColor()}`} />
          <span className={`font-mono-data text-xs ${getBatteryColor()}`}>
            {systemStatus.battery.toFixed(0)}%
          </span>
        </div>

        {/* Time */}
        <div className="topbar-segment border-r border-border">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono-data text-xs text-foreground">
            {formatTime(Date.now())}
          </span>
        </div>

        {/* Last data */}
        <div className="topbar-segment border-r border-border">
          <span className="text-xs text-muted-foreground">Data:</span>
          <span className="font-mono-data text-xs text-status-success">
            {formatTimestamp(systemStatus.lastDataTimestamp)}
          </span>
        </div>

        {/* Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="topbar-segment">
            <AlertTriangle className="w-4 h-4 text-status-error" />
            <span className="text-xs text-status-error font-medium">
              {criticalAlerts.length}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
