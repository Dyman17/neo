# 🏺 ArchaeoScan Frontend

React frontend for ArchaeoScan - real-time archaeological monitoring platform.

## 🚀 Deployment

This frontend is deployed on Vercel and connects to the HuggingFace backend.

### Live Demo
- **Frontend**: https://archaeoscan-frontend.vercel.app
- **Backend**: https://dyman17-archaeoscan.hf.space

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for components
- **React Router** for navigation
- **TanStack Query** for data fetching
- **WebSocket** for real-time data

## 📡 API Connection

The frontend connects to the HuggingFace backend via WebSocket:
- **WebSocket URL**: `wss://dyman17-archaeoscan.hf.space/ws`
- **API Base URL**: `https://dyman17-archaeoscan.hf.space`

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Features

- 🌊 Real-time sensor data dashboard
- 📊 Interactive charts and visualizations
- 🗺️ Map view for sensor locations
- 📡 Camera stream integration
- ⚙️ Settings and configuration
- 📱 Responsive design

## 🏗️ Architecture

```
Vercel Frontend ←→ HuggingFace Backend ←→ ESP32 Sensors
```

## 📄 Environment Variables

Create `.env.local` for development:

```env
VITE_API_BASE_URL=https://dyman17-archaeoscan.hf.space
VITE_WS_URL=wss://dyman17-archaeoscan.hf.space/ws
```

## 🚀 Deploy on Vercel

1. Connect this repository to Vercel
2. Vercel will automatically detect it's a React/Vite app
3. Deploy with default settings
4. Environment variables are configured in Vercel dashboard

## 📊 Supported Sensors

- TLV493D (magnetometer)
- MPU-9250 (accelerometer/gyro)
- AS7343 (spectrometer)
- TS-300b (turbidity)
- DS18B20 (water temperature)
- TDS meter
- HC-SR04T (ultrasonic)
- ESP32-CAM
