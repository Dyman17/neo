import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Wifi, 
  Gauge, 
  Bell, 
  Palette, 
  Database, 
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('connection');

  const tabs = [
    { id: 'connection', label: 'Connection', icon: Wifi },
    { id: 'calibration', label: 'Calibration', icon: Gauge },
    { id: 'thresholds', label: 'Thresholds', icon: Bell },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'data', label: 'Data', icon: Database },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">System configuration and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Tab navigation */}
        <div className="card-instrument p-2 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="col-span-3 card-instrument p-6">
          {activeTab === 'connection' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-foreground">Connection Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">WebSocket Endpoint</label>
                  <input
                    type="text"
                    defaultValue="ws://localhost:8080"
                    className="w-full px-3 py-2 bg-secondary text-foreground font-mono-data text-sm rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">REST API Base URL</label>
                  <input
                    type="text"
                    defaultValue="http://localhost:3000/api"
                    className="w-full px-3 py-2 bg-secondary text-foreground font-mono-data text-sm rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div>
                    <div className="text-sm text-foreground">Auto-reconnect</div>
                    <div className="text-xs text-muted-foreground">Automatically reconnect on connection loss</div>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-primary relative">
                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-primary-foreground" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div>
                    <div className="text-sm text-foreground">Heartbeat interval</div>
                    <div className="text-xs text-muted-foreground">Ping frequency in seconds</div>
                  </div>
                  <input
                    type="number"
                    defaultValue={5}
                    className="w-20 px-3 py-1.5 bg-secondary text-foreground font-mono-data text-sm rounded-md border border-border text-center"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calibration' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-foreground">Sensor Calibration</h2>
              
              <div className="space-y-4">
                {['Temperature', 'Humidity', 'Pressure', 'TDS'].map((sensor) => (
                  <div key={sensor} className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <div className="text-sm text-foreground">{sensor}</div>
                      <div className="text-xs text-muted-foreground">Last calibrated: 2024-01-10</div>
                    </div>
                    <button className="px-4 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                      Calibrate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'thresholds' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-foreground">Alert Thresholds</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'Temperature', unit: '°C', warning: [10, 35], critical: [5, 40] },
                  { name: 'Humidity', unit: '%', warning: [30, 80], critical: [20, 90] },
                  { name: 'Battery', unit: '%', warning: [20, 100], critical: [10, 100] },
                ].map((threshold) => (
                  <div key={threshold.name} className="p-4 bg-secondary/30 rounded-md">
                    <div className="text-sm font-medium text-foreground mb-3">{threshold.name}</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-status-warning block mb-1">Warning Range</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={threshold.warning[0]}
                            className="w-20 px-2 py-1 bg-secondary text-foreground font-mono-data text-sm rounded border border-border text-center"
                          />
                          <span className="text-muted-foreground">–</span>
                          <input
                            type="number"
                            defaultValue={threshold.warning[1]}
                            className="w-20 px-2 py-1 bg-secondary text-foreground font-mono-data text-sm rounded border border-border text-center"
                          />
                          <span className="text-xs text-muted-foreground">{threshold.unit}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-status-error block mb-1">Critical Range</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={threshold.critical[0]}
                            className="w-20 px-2 py-1 bg-secondary text-foreground font-mono-data text-sm rounded border border-border text-center"
                          />
                          <span className="text-muted-foreground">–</span>
                          <input
                            type="number"
                            defaultValue={threshold.critical[1]}
                            className="w-20 px-2 py-1 bg-secondary text-foreground font-mono-data text-sm rounded border border-border text-center"
                          />
                          <span className="text-xs text-muted-foreground">{threshold.unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-foreground">Display Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="text-sm text-foreground">Temperature unit</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md">°C</button>
                    <button className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md">°F</button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="text-sm text-foreground">Pressure unit</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md">hPa</button>
                    <button className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md">mbar</button>
                    <button className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md">inHg</button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="text-sm text-foreground">Graph refresh rate</div>
                  </div>
                  <select className="px-3 py-1.5 bg-secondary text-foreground text-sm rounded-md border border-border">
                    <option>10 Hz</option>
                    <option>5 Hz</option>
                    <option>1 Hz</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-foreground">Data Management</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                    <Upload className="w-4 h-4" />
                    Import Config
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                    <Download className="w-4 h-4" />
                    Export Config
                  </button>
                </div>

                <div className="p-4 bg-status-error/10 border border-status-error/20 rounded-md">
                  <div className="text-sm font-medium text-status-error mb-2">Danger Zone</div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Reset all settings to factory defaults. This cannot be undone.
                  </p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-status-error text-destructive-foreground rounded-md hover:bg-status-error/90 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                    Factory Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
