# 🏺 RobArch System - Underwater Archaeological Exploration

**Professional underwater archaeological exploration system with AI-powered artifact detection**

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm run setup

# 2. Start the system
npm start

# 3. System will be available at:
# 🌐 Web Interface: http://localhost:3000
# 📡 WebSocket: ws://localhost:3000  
# 🤖 AI Service: http://localhost:5000
```

## 📁 Project Structure

```
robarch-system/
├── server.js          # 🎯 Main Node.js server (ALL functions)
├── ai-service.py      # 🤖 Python AI service for material classification
├── public/           # 🖥️ Built React frontend
├── esp32-firmware/   # 📦 ESP32 drone firmware
├── docs/            # 📚 Documentation
├── package.json     # 📦 Node.js dependencies
└── README.md       # 📘 This file
```

## ⭐ Key Features

### 🔍 10 Core Functions Integrated:

1. **Artifact Analyzer** - Intelligent material identification (metal/stone/ceramic/organic)
2. **Preservation Index** - Artifact preservation score (0-100%)
3. **Sediment Detector** - Burial depth and sediment analysis
4. **Magnetic Mapper** - Magnetic anomaly heatmaps
5. **Degradation Tracker** - Environmental condition monitoring
6. **Seabed Classifier** - Ocean floor type classification
7. **Confidence Meter** - Data reliability indicators
8. **Smart Notifications** - Automated alerts system
9. **Artifact Profiler** - Found object cataloging
10. **AI Chat Assistant** - Natural language interpretation

### 🎯 Advanced Capabilities:

- **Real-time sensor data processing**
- **WebSocket communication with drones**
- **Machine learning material classification**
- **Historical data analysis**
- **Multi-sensor fusion algorithms**
- **Scientific-grade measurements**

## 🛠️ Hardware Integration

### Supported Sensors:
- **TLV493D Magnetometer** - Metal detection
- **AS7343 Spectrometer** - Material composition
- **Piezoelectric Element** - Vibration/density analysis
- **HC-SR04T Ultrasonic** - Distance/proximity
- **MPU-9250 Accelerometer** - Motion/seabed classification
- **DS18B20 Temperature** - Environmental conditions
- **TDS Meter** - Water quality
- **TS-300b Turbidity** - Water clarity

### Communication:
- **ESP32-CAM** - Video streaming
- **WiFi/MQTT** - Drone communication
- **WebSocket** - Real-time data transfer

## 🚀 Deployment

### Local Development:
```bash
npm run dev  # Development mode with auto-restart
```

### Production:
```bash
npm start    # Production mode
```

### Docker (coming soon):
```bash
docker-compose up
```

## 📊 API Endpoints

### Sensor Data:
```
POST /sensor-data          # Receive ESP32 sensor data
GET  /history             # Get sensor history
GET  /artifacts           # Get found artifacts
```

### AI Services:
```
POST /api/chat-assistant   # AI chat bot
GET  /api/sensor-database  # Historical database
```

## 🤖 AI Chat Assistant

Access via `/chat` route. Can answer questions like:
- "What could this be?"
- "Why does the system think it's metal?"
- "What are the preservation conditions?"
- "Recommendations for extraction?"

## 📱 Web Interface

Modern React dashboard with:
- Real-time sensor monitoring
- Interactive maps
- Artifact catalog
- AI chat interface
- Scientific data visualization

## 🔧 Configuration

Environment variables:
```bash
PORT=3000              # Server port
PYTHON_AI_PORT=5000    # AI service port
```

## 📚 Documentation

See `docs/` folder for:
- API documentation
- Hardware setup guides
- ESP32 firmware documentation
- Scientific methodology

## 👥 Team

Developed for FLL competition with focus on:
- **Scientific accuracy**
- **Professional implementation**
- **Educational value**
- **Real-world applicability**

---
*RobArch System - Bringing underwater archaeology into the digital age*