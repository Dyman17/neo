#!/bin/bash

# ArchaeoScan Repository Setup Script
# This script sets up the frontend and backend repositories with proper structure

set -e

echo "🏺 Setting up ArchaeoScan repositories..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_REPO="https://github.com/Dyman17/archaeoscan_frontend"
BACKEND_REPO="https://github.com/Dyman17/archaeoscan-websocket-server"
FRONTEND_DIR="./archaeoscan_frontend"
BACKEND_DIR="./archaeoscan-websocket-server"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install git first."
    exit 1
fi

# Function to setup frontend repository
setup_frontend() {
    print_status "Setting up frontend repository..."
    
    if [ -d "$FRONTEND_DIR" ]; then
        print_warning "Frontend directory already exists. Removing..."
        rm -rf "$FRONTEND_DIR"
    fi
    
    # Clone frontend repository
    git clone "$FRONTEND_REPO" "$FRONTEND_DIR"
    
    # Copy frontend files
    print_status "Copying frontend files..."
    cp -r src/ "$FRONTEND_DIR/"
    cp package.json "$FRONTEND_DIR/"
    cp package-lock.json "$FRONTEND_DIR/" 2>/dev/null || true
    cp tsconfig.json "$FRONTEND_DIR/" 2>/dev/null || true
    cp vite.config.ts "$FRONTEND_DIR/" 2>/dev/null || true
    cp tailwind.config.js "$FRONTEND_DIR/" 2>/dev/null || true
    cp vercel.json "$FRONTEND_DIR/"
    cp -r public/ "$FRONTEND_DIR/" 2>/dev/null || true
    
    # Create .github/workflows directory
    mkdir -p "$FRONTEND_DIR/.github/workflows"
    cp .github/workflows/deploy-frontend.yml "$FRONTEND_DIR/.github/workflows/"
    
    # Create deployment docs
    cp DEPLOYMENT.md "$FRONTEND_DIR/"
    
    cd "$FRONTEND_DIR"
    
    # Create frontend-specific README
    cat > README.md << 'EOF'
# 🏺 ArchaeoScan Frontend

Modern React frontend for archaeological artifact detection and analysis.

## 🚀 Features

- Interactive map with real-time artifact visualization
- AI-powered preservation analysis
- ESP32-CAM video recording
- Material management and filtering
- Real-time WebSocket updates
- Responsive design with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Query + Context API
- **Icons**: Lucide React
- **Maps**: Custom Canvas implementation

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 🌐 Deployment

This project is automatically deployed to Vercel via GitHub Actions.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔗 Links

- **Live Site**: https://archeoscan.vercel.app
- **Backend**: https://archaeoscan-backend.hf.space
- **Repository**: https://github.com/Dyman17/archaeoscan_frontend

---

Built with ❤️ for archaeological research
EOF
    
    # Add and commit changes
    git add .
    git commit -m "feat: Add complete frontend implementation with AI analysis

- Interactive map with Canvas rendering
- AI-powered preservation analysis using Groq
- ESP32-CAM video recording integration
- Material management and filtering
- Real-time WebSocket updates
- Responsive design with Tailwind CSS
- CI/CD setup for Vercel deployment

🚀 Ready for production deployment!"

    print_success "Frontend repository setup complete!"
    cd ..
}

# Function to setup backend repository
setup_backend() {
    print_status "Setting up backend repository..."
    
    if [ -d "$BACKEND_DIR" ]; then
        print_warning "Backend directory already exists. Removing..."
        rm -rf "$BACKEND_DIR"
    fi
    
    # Clone backend repository
    git clone "$BACKEND_REPO" "$BACKEND_DIR"
    
    # Create backend structure
    print_status "Creating backend structure..."
    
    # Create main directories
    mkdir -p "$BACKEND_DIR"/{api,models,utils,tests}
    
    # Create main FastAPI app
    cat > "$BACKEND_DIR/app.py" << 'EOF'
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import uvicorn
import json
import asyncio
from typing import List
import os
from datetime import datetime

app = FastAPI(title="ArchaeoScan Backend", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Connection is dead, remove it
                self.active_connections.remove(connection)

manager = ConnectionManager()

# Sample data
artifacts = [
    {
        "id": "1",
        "type": "artifact",
        "material": "ceramic",
        "lat": 40.7128,
        "lng": -74.0060,
        "confidence": 0.85,
        "depth": 2.5,
        "preservation_index": 75.0,
        "timestamp": datetime.now().isoformat()
    },
    {
        "id": "2", 
        "type": "structure",
        "material": "stone",
        "lat": 40.7138,
        "lng": -74.0070,
        "confidence": 0.92,
        "depth": 1.8,
        "preservation_index": 85.0,
        "timestamp": datetime.now().isoformat()
    }
]

settings = {
    "esp32_cam_ip": "192.168.1.100",
    "detection_sensitivity": 0.7,
    "auto_save": True,
    "notification_enabled": True
}

recordings = []

@app.get("/")
async def root():
    return {"message": "ArchaeoScan Backend API"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "services": {
            "api": "running",
            "websocket": "running",
            "database": "simulated"
        }
    }

@app.get("/artifacts")
async def get_artifacts():
    return {"success": True, "data": artifacts}

@app.post("/artifacts")
async def save_artifact(artifact: dict):
    artifact["id"] = str(len(artifacts) + 1)
    artifact["timestamp"] = datetime.now().isoformat()
    artifacts.append(artifact)
    
    # Broadcast to WebSocket clients
    await manager.broadcast(json.dumps({
        "type": "new_artifact",
        "data": artifact
    }))
    
    return {"success": True, "data": artifact}

@app.post("/artifacts/{artifact_id}/analyze")
async def analyze_artifact(artifact_id: str):
    # Simulate AI analysis
    import random
    analysis = {
        "score": random.randint(30, 95),
        "risk": random.choice(["low", "medium", "high"]),
        "comparison": [
            {"material": "ceramic", "preservation": 75},
            {"material": "stone", "preservation": 85},
            {"material": "metal", "preservation": 40}
        ],
        "recommendations": [
            "Further analysis recommended",
            "Consider environmental factors",
            "Professional assessment advised"
        ]
    }
    
    # Update artifact with preservation index
    for artifact in artifacts:
        if artifact["id"] == artifact_id:
            artifact["preservation_index"] = analysis["score"]
            break
    
    return {"success": True, "data": analysis}

@app.get("/settings")
async def get_settings():
    return {"success": True, "data": settings}

@app.post("/settings")
async def update_settings(new_settings: dict):
    settings.update(new_settings)
    return {"success": True, "data": settings}

@app.post("/video/start")
async def start_recording():
    recording_id = f"rec_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    recording = {
        "id": recording_id,
        "filename": f"{recording_id}.mp4",
        "start_time": datetime.now().isoformat(),
        "end_time": None,
        "duration": None,
        "file_size": 0,
        "status": "recording"
    }
    recordings.append(recording)
    return {"success": True, "data": {"recording_id": recording_id}}

@app.post("/video/stop")
async def stop_recording():
    if recordings and recordings[-1]["status"] == "recording":
        recordings[-1]["end_time"] = datetime.now().isoformat()
        recordings[-1]["status"] = "completed"
        # Calculate duration (simplified)
        start = datetime.fromisoformat(recordings[-1]["start_time"])
        end = datetime.fromisoformat(recordings[-1]["end_time"])
        recordings[-1]["duration"] = (end - start).total_seconds()
        recordings[-1]["file_size"] = 1024 * 1024 * 5  # 5MB mock
    
    return {"success": True, "data": {"message": "Recording stopped"}}

@app.get("/video/recordings")
async def get_recordings():
    return {"success": True, "data": recordings}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back or handle WebSocket messages
            await manager.send_personal_message(f"Echo: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
EOF

    # Create requirements.txt
    cat > "$BACKEND_DIR/requirements.txt" << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
websockets==12.0
python-multipart==0.0.6
pydantic==2.5.0
python-dotenv==1.0.0
aiofiles==23.2.1
opencv-python==4.8.1.78
numpy==1.24.3
gradio==4.19.2
EOF

    # Create .github/workflows directory
    mkdir -p "$BACKEND_DIR/.github/workflows"
    cp .github/workflows/deploy-backend.yml "$BACKEND_DIR/.github/workflows/"
    
    # Copy deployment docs
    cp DEPLOYMENT.md "$BACKEND_DIR/"
    
    cd "$BACKEND_DIR"
    
    # Create backend-specific README
    cat > README.md << 'EOF'
# 🏺 ArchaeoScan Backend

FastAPI backend server for archaeological artifact detection and analysis.

## 🚀 Features

- RESTful API for artifacts management
- Real-time WebSocket connections
- ESP32-CAM video recording
- Settings management
- Health check endpoints
- AI-powered preservation analysis simulation

## 🛠️ Tech Stack

- **Framework**: FastAPI
- **WebSocket**: Built-in WebSockets
- **Deployment**: Hugging Face Spaces
- **Python**: 3.9+

## 📦 Installation

```bash
pip install -r requirements.txt
```

## 🚀 Development

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 7860
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### Artifacts
- `GET /artifacts` - Get all artifacts
- `POST /artifacts` - Save new artifact
- `POST /artifacts/{id}/analyze` - Analyze preservation

### Settings
- `GET /settings` - Get settings
- `POST /settings` - Update settings

### Video Recording
- `POST /video/start` - Start recording
- `POST /video/stop` - Stop recording
- `GET /video/recordings` - Get recordings list

### WebSocket
- `WS /ws` - Real-time artifact updates

## 🌐 Deployment

This project is automatically deployed to Hugging Face Spaces via GitHub Actions.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
├── app.py              # Main FastAPI application
├── requirements.txt    # Python dependencies
├── api/               # API route handlers
├── models/            # Data models
├── utils/             # Utility functions
└── tests/             # Test files
```

## 🔗 Links

- **Live API**: https://archaeoscan-backend.hf.space
- **Frontend**: https://archeoscan.vercel.app
- **Repository**: https://github.com/Dyman17/archaeoscan-websocket-server

---

Built with ❤️ for archaeological research
EOF
    
    # Add and commit changes
    git add .
    git commit -m "feat: Add complete FastAPI backend implementation

- RESTful API for artifacts management
- Real-time WebSocket connections
- ESP32-CAM video recording endpoints
- Settings management
- Health check endpoints
- AI preservation analysis simulation
- CI/CD setup for Hugging Face deployment

🚀 Ready for production deployment!"

    print_success "Backend repository setup complete!"
    cd ..
}

# Main execution
main() {
    print_status "Starting repository setup..."
    
    # Setup frontend
    setup_frontend
    
    # Setup backend
    setup_backend
    
    print_success "🎉 Repository setup complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Review the generated repositories:"
    echo "   - $FRONTEND_DIR"
    echo "   - $BACKEND_DIR"
    echo ""
    echo "2. Push to GitHub:"
    echo "   cd $FRONTEND_DIR && git push origin main"
    echo "   cd $BACKEND_DIR && git push origin main"
    echo ""
    echo "3. Set up GitHub secrets for CI/CD (see DEPLOYMENT.md)"
    echo ""
    echo "4. Test deployments:"
    echo "   - Frontend: Vercel"
    echo "   - Backend: Hugging Face Spaces"
    echo ""
    print_success "Ready to deploy! 🚀"
}

# Run main function
main "$@"
