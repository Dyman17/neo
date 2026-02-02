# 🏺 ArchaeoScan Monorepo

Complete archaeological monitoring platform with React frontend and FastAPI backend.

## 🏗️ Monorepo Structure

```
fll/
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # FastAPI WebSocket server
│   ├── src/
│   ├── requirements.txt
│   └── package.json
├── .github/
│   └── workflows/    # CI/CD pipelines
└── package.json      # Root workspace config
```

## 🚀 Deployment

### **Frontend → Vercel**
- **Root Directory**: `frontend/`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Live**: https://archaeoscan-frontend.vercel.app

### **Backend → Hugging Face**
- **Root Directory**: `backend/`
- **SDK**: Gradio/Python
- **Live**: https://huggingface.co/spaces/Dyman17/archaeoscan-ws

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for components
- **React Router** for navigation
- **TanStack Query** for data fetching
- **WebSocket** for real-time data

### Backend
- **FastAPI** with WebSocket
- **Uvicorn** ASGI server
- **Gradio** for Hugging Face deployment
- **OpenCV** for image processing
- **NumPy** for data processing

## 🔧 Development

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend  
npm run dev:backend

# Build frontend
npm run build:frontend
```

## 📡 API Connection

- **WebSocket URL**: `wss://huggingface.co/spaces/Dyman17/archaeoscan-ws/ws`
- **API Base URL**: `https://huggingface.co/spaces/Dyman17/archaeoscan-ws`
- **Health Check**: `/health`
- **Settings**: `/settings`

## 📱 Features

- 🌊 Real-time sensor data dashboard
- 📊 Interactive charts and visualizations
- 🗺️ Interactive map with artifact tracking
- 📡 ESP32-CAM stream integration
- 🤖 AI-powered preservation analysis
- ⚙️ Real-time system settings
- 📱 Responsive design

## 🔄 CI/CD

### GitHub Actions
- **`.github/workflows/deploy-frontend.yml`** → Vercel
- **`.github/workflows/deploy-backend.yml`** → Hugging Face

### Automatic Triggers
- Push to `main` branch
- Deploys both frontend and backend
- Separate deployments, single repository

## 📄 Environment Variables

### Frontend (Vercel)
```env
VITE_API_URL=https://huggingface.co/spaces/Dyman17/archaeoscan-ws
VITE_WS_URL=wss://huggingface.co/spaces/Dyman17/archaeoscan-ws/ws
```

### Backend (Hugging Face)
```env
GROQ_API_KEY=your_groq_key
ESP32_CAM_URL=http://192.168.1.77
```

## 🏗️ Architecture

```
Vercel Frontend ←→ Hugging Face Backend ←→ ESP32 Sensors
     ↓                     ↓                    ↓
  React App          FastAPI + WS         Camera + Sensors
```

## 📊 Supported Sensors

- TLV493D (magnetometer)
- MPU-9250 (accelerometer/gyro)
- AS7343 (spectrometer)
- TS-300b (turbidity)
- DS18B20 (water temperature)
- TDS meter
- HC-SR04T (ultrasonic)
- ESP32-CAM

## 🚀 Quick Start

1. **Clone repository**
```bash
git clone https://github.com/Dyman17/archaeoscan-monorepo.git
cd archaeoscan-monorepo
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Start development**
```bash
npm run dev
```

4. **Access applications**
- Frontend: http://localhost:5173
- Backend: http://localhost:7860
- API Docs: http://localhost:7860/docs

## 📝 Monorepo Benefits

✅ **Single repository** - unified version control  
✅ **Shared dependencies** - managed via workspaces  
✅ **Coordinated development** - frontend/backend together  
✅ **Separate deployment** - Vercel + Hugging Face  
✅ **Atomic commits** - related changes in one PR  
✅ **Simplified CI/CD** - automated deployments
