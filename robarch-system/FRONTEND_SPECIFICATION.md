# ArchaeoScan Frontend Specification

## Data Sources & Integration

### 1. WebSocket Connection
- **Endpoint**: `ws://localhost:8080`
- **Purpose**: Real-time sensor data streaming
- **Data Format**: JSON objects with sensor readings
- **Frequency**: Continuous streaming (typically 1-10 Hz depending on sensor)

### 2. Sensor Data Structure
```json
{
  "timestamp": 1634567890123,
  "sensors": {
    "temperature": 22.5,
    "humidity": 45.2,
    "pressure": 1013.25,
    "tds": 420,
    "distance": 3.2,
    "magnetometer": [0.12, -0.45, 0.89],
    "accelerometer": [0.02, 0.01, 9.81],
    "gyroscope": [0.001, -0.002, 0.003],
    "battery": 85.5,
    "gps": {
      "lat": 55.7558,
      "lng": 37.6176,
      "accuracy": 2.5
    }
  },
  "spectrometer": {
    "spectrum": [0.1, 0.2, 0.3, ...],
    "wavelengths": [400, 410, 420, ...],
    "intensity": [0.15, 0.25, 0.35, ...]
  }
}
```

### 3. REST API Endpoints
- **GET /api/sensors**: Historical sensor data
- **POST /api/calibrate**: Sensor calibration commands
- **GET /api/system/status**: System health status
- **POST /api/control**: Equipment control commands
- **GET /api/reports**: Generated reports and analyses

## Calculations & Algorithms

### 1. Environmental Preservation Index
**Formula**: 
```
temp_factor = temperature < 10 ? 0.9 : temperature > 25 ? 0.6 : 0.8
tds_factor = tds < 300 ? 0.9 : tds > 800 ? 0.4 : 0.7
turbidity_factor = turbidity < 50 ? 0.85 : 0.5
index = Math.round((temp_factor + tds_factor + turbidity_factor) / 3 * 100)
```

### 2. Material Classification
- **Input**: Spectrometer data + sensor readings
- **Algorithm**: Machine learning model inference
- **Output**: Material type prediction with confidence score
- **Categories**: metal, ceramic, organic, stone, unknown

### 3. Radar Processing
- **Input**: Ground penetrating radar signals
- **Processing**: Signal filtering, noise reduction, target detection
- **Output**: Depth profiles and anomaly detection

### 4. Status Determination
```javascript
const getStatus = (value, thresholds) => {
  if (value >= thresholds.critical) return 'error';
  if (value >= thresholds.warning) return 'warning';
  if (value <= thresholds.lowCritical) return 'error';
  if (value <= thresholds.lowWarning) return 'warning';
  return 'ok';
};
```

## Frontend Architecture Requirements

### 1. Real-time Data Handling
- WebSocket connection management
- Automatic reconnection with exponential backoff
- Data buffering and queuing
- Connection status indicators

### 2. State Management
- Global state for sensor data
- Local state for UI interactions
- Data persistence for offline capability
- Cache invalidation strategies

### 3. Visualization Components
- Real-time charts (Chart.js, D3.js)
- Geographic maps (Leaflet, Mapbox)
- Radar displays (Canvas/WebGL)
- Spectral analysis plots
- Status indicators and gauges

### 4. Performance Requirements
- Update frequency: 10Hz for critical sensors
- Data retention: Last 1000 readings in memory
- Chart rendering: Smooth animation without jank
- Mobile responsiveness: All features work on tablets

## UI Components Specification

### 1. Sensor Cards
- Real-time value display
- Status indicators (color-coded)
- Historical trend mini-charts
- Unit conversion options
- Calibration controls

### 2. Dashboard Grid
- Responsive grid layout (CSS Grid/Flexbox)
- Draggable/resizable panels
- Auto-refresh intervals
- Customizable layouts

### 3. Video Stream
- MJPEG/HLS stream display
- Recording controls
- Overlay data display
- Fullscreen capability

### 4. Map Interface
- GPS position tracking
- Marker management
- Layer controls
- Measurement tools
- Offline map support

## Error Handling & Fallbacks

### 1. Connection States
- Connected: Normal operation
- Connecting: Attempting to connect
- Disconnected: Connection lost
- Error: Connection failed

### 2. Data Validation
- Range checking for sensor values
- Timestamp validation
- Data format verification
- Graceful degradation for missing data

### 3. Offline Capabilities
- Cached data display
- Local storage of settings
- Queue outgoing commands
- Sync when connection restored

## Security Considerations

### 1. Authentication
- Session management
- Token refresh mechanisms
- Secure credential storage

### 2. Data Privacy
- Encryption in transit (WSS)
- Local data protection
- Access control enforcement

## Technical Stack Requirements

### 1. Framework
- React 18 with TypeScript
- State management (Redux Toolkit/Zustand)
- Routing (React Router)

### 2. Styling
- Tailwind CSS for utility-first approach
- Responsive design system
- Dark/light theme support

### 3. Libraries
- WebSocket client for real-time data
- Charting library for visualizations
- Map library for geographic data
- Form validation library

## Deployment Configuration

### 1. Environment Variables
- WebSocket server URL
- API base URL
- Timeout configurations
- Feature flags

### 2. Build Optimizations
- Code splitting
- Tree shaking
- Asset optimization
- Bundle analysis

This specification provides a complete blueprint for developing a new frontend that properly integrates with your backend system while maintaining all the necessary functionality for archaeological research operations.