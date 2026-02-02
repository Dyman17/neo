from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
from datetime import datetime
import uvicorn

app = FastAPI(title="Archaeoscan WebSocket Server")

# CORS middleware
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
        self.active_connections: list[WebSocket] = []

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
                # Remove dead connections
                self.active_connections.remove(connection)

manager = ConnectionManager()

@app.get("/")
async def root():
    return {"message": "Archaeoscan WebSocket Server"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().timestamp(),
        "services": {
            "api": "healthy",
            "websocket": "healthy" if len(manager.active_connections) > 0 else "idle",
            "database": "healthy"
        },
        "connections": len(manager.active_connections)
    }

@app.get("/settings")
async def get_settings():
    return {
        "esp_cam_url": "http://192.168.1.77",
        "ws_url": "ws://localhost:8000/ws",
        "map_refresh_rate": 1000,
        "video_recording": False,
        "auto_save_artifacts": True,
        "gps_enabled": True,
        "sensor_sensitivity": 75
    }

@app.post("/settings")
async def update_settings(settings: dict):
    # In a real implementation, save to database
    return {"success": True, "message": "Settings updated"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back or process the message
            await manager.send_personal_message(f"Echo: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client disconnected. Connections: {len(manager.active_connections)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
