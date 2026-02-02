import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";

// WebSocket connection context
const WebSocketContext = React.createContext<any>(null);

function App() {
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<any>(null);
  
  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSensorData(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    setWebsocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ websocket, isConnected, sensorData }}>
      <Router>
        <div className="flex h-screen">
          <Sidebar isConnected={isConnected} />
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard sensorData={sensorData} />} />
              <Route path="/sensors" element={<div>Sensors Page</div>} />
              <Route path="/radar" element={<div>Radar Page</div>} />
              <Route path="/map" element={<div>Map Page</div>} />
              <Route path="/materials" element={<div>Materials Page</div>} />
              <Route path="/settings" element={<div>Settings Page</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WebSocketContext.Provider>
  );
}

export default App;
