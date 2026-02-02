import { useState, useEffect } from "react";
import { Thermometer, Droplets, Eye } from "lucide-react";

export function Dashboard() {
  const [data, setData] = useState({
    temperature: 22, tds: 420, turbidity: 40, battery: 88
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(d => ({
        ...d,
        temperature: d.temperature + Math.random()*2-1,
        tds: d.tds + Math.random()*10-5,
        turbidity: d.turbidity + Math.random()*5-2
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (val:number, min:number, max:number)=> val<min||val>max?"text-red-500":"text-green-500";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="science-card text-center">
        <Thermometer className={`mx-auto w-6 h-6 ${getStatusColor(data.temperature,10,25)}`} />
        <div className="text-xl font-bold">{data.temperature.toFixed(1)}°C</div>
        <div className="text-sm text-muted">Temperature</div>
      </div>
      <div className="science-card text-center">
        <Droplets className={`mx-auto w-6 h-6 ${getStatusColor(data.tds,300,800)}`} />
        <div className="text-xl font-bold">{data.tds.toFixed(0)} ppm</div>
        <div className="text-sm text-muted">TDS</div>
      </div>
      <div className="science-card text-center">
        <Eye className={`mx-auto w-6 h-6 ${getStatusColor(data.turbidity,0,50)}`} />
        <div className="text-xl font-bold">{data.turbidity.toFixed(0)} NTU</div>
        <div className="text-sm text-muted">Turbidity</div>
      </div>
    </div>
  );
}
