import { useState, useEffect } from "react";
import { Thermometer, Droplets, Eye } from "lucide-react";

interface DashboardProps {
  sensorData?: any;
}

export function Dashboard({ sensorData }: DashboardProps) {
  // Use real sensor data if available, otherwise fallback to mock data
  const [localData, setLocalData] = useState({
    temperature: 22, 
    tds: 420, 
    turbidity: 40, 
    battery: 88
  });

  // Update local data when sensorData changes
  useEffect(() => {
    if (sensorData && sensorData.sensors) {
      setLocalData(prev => ({
        ...prev,
        temperature: sensorData.sensors.temperature || prev.temperature,
        tds: sensorData.sensors.tds || prev.tds,
        turbidity: sensorData.sensors.turbidity || prev.turbidity,
        battery: sensorData.sensors.battery || prev.battery
      }));
    }
  }, [sensorData]);

  // Continue mock data updates if no real data is available
  useEffect(() => {
    const interval = setInterval(() => {
      // Only update with mock data if no real sensor data is coming in
      if (!sensorData || !sensorData.sensors) {
        setLocalData(d => ({
          ...d,
          temperature: d.temperature + Math.random()*2-1,
          tds: d.tds + Math.random()*10-5,
          turbidity: d.turbidity + Math.random()*5-2
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sensorData]);

  const getStatusColor = (val:number, min:number, max:number)=> val<min||val>max?"text-red-500":"text-green-500";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="science-card text-center">
        <Thermometer className={`mx-auto w-6 h-6 ${getStatusColor(localData.temperature,10,25)}`} />
        <div className="text-xl font-bold">{localData.temperature.toFixed(1)}°C</div>
        <div className="text-sm text-muted">Temperature</div>
      </div>
      <div className="science-card text-center">
        <Droplets className={`mx-auto w-6 h-6 ${getStatusColor(localData.tds,300,800)}`} />
        <div className="text-xl font-bold">{localData.tds.toFixed(0)} ppm</div>
        <div className="text-sm text-muted">TDS</div>
      </div>
      <div className="science-card text-center">
        <Eye className={`mx-auto w-6 h-6 ${getStatusColor(localData.turbidity,0,50)}`} />
        <div className="text-xl font-bold">{localData.turbidity.toFixed(0)} NTU</div>
        <div className="text-sm text-muted">Turbidity</div>
      </div>
    </div>
  );
}
