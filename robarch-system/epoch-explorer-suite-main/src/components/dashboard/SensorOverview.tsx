import { useState, useEffect } from "react";
import {
  Waves,
  Droplets,
  Radio,
  Compass,
  Battery,
  Navigation,
} from "lucide-react";
import { SensorCard, SensorStatus } from "./SensorCard";

interface SensorData {
  piezo: { value: number; status: SensorStatus };
  tds: { value: number; status: SensorStatus };
  ultrasound: { value: number; status: SensorStatus };
  magnetometer: { value: number; status: SensorStatus };
  battery: { value: number; status: SensorStatus };
  gps: { lat: number; lng: number; accuracy: number; status: SensorStatus };
}

const initialSensorData: SensorData = {
  piezo: { value: 42.7, status: "ok" },
  tds: { value: 523, status: "ok" },
  ultrasound: { value: 2.34, status: "ok" },
  magnetometer: { value: 48.2, status: "warning" },
  battery: { value: 78, status: "ok" },
  gps: { lat: 55.7558, lng: 37.6173, accuracy: 0.5, status: "ok" },
};

export function SensorOverview() {
  const [sensorData, setSensorData] = useState<SensorData>(initialSensorData);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prev) => ({
        piezo: {
          value: Math.max(0, prev.piezo.value + (Math.random() - 0.5) * 2),
          status: prev.piezo.status,
        },
        tds: {
          value: Math.max(0, prev.tds.value + (Math.random() - 0.5) * 10),
          status: prev.tds.status,
        },
        ultrasound: {
          value: Math.max(0, prev.ultrasound.value + (Math.random() - 0.5) * 0.1),
          status: prev.ultrasound.status,
        },
        magnetometer: {
          value: Math.max(0, prev.magnetometer.value + (Math.random() - 0.5) * 1),
          status: prev.magnetometer.status,
        },
        battery: {
          value: Math.max(0, Math.min(100, prev.battery.value - Math.random() * 0.01)),
          status: prev.battery.value < 20 ? "error" : prev.battery.value < 40 ? "warning" : "ok",
        },
        gps: prev.gps,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const sensors = [
    {
      icon: Waves,
      label: "Пьезо",
      value: sensorData.piezo.value.toFixed(1),
      unit: "мВ",
      status: sensorData.piezo.status,
      description: "Пьезоэлектрический датчик — измеряет вибрации и давление в почве",
    },
    {
      icon: Droplets,
      label: "TDS",
      value: Math.round(sensorData.tds.value),
      unit: "ppm",
      status: sensorData.tds.status,
      description: "Total Dissolved Solids — уровень растворённых твёрдых веществ в воде",
    },
    {
      icon: Radio,
      label: "Ультразвук",
      value: sensorData.ultrasound.value.toFixed(2),
      unit: "м",
      status: sensorData.ultrasound.status,
      description: "Ультразвуковой датчик — глубина зондирования и обнаружение полостей",
    },
    {
      icon: Compass,
      label: "Магнитометр",
      value: sensorData.magnetometer.value.toFixed(1),
      unit: "мкТл",
      status: sensorData.magnetometer.status,
      description: "Магнитометр — обнаружение металлических объектов и аномалий",
    },
    {
      icon: Battery,
      label: "Батарея",
      value: Math.round(sensorData.battery.value),
      unit: "%",
      status: sensorData.battery.status,
      description: "Уровень заряда батареи зонда",
    },
    {
      icon: Navigation,
      label: "GPS",
      value: `${sensorData.gps.lat.toFixed(4)}°`,
      unit: "",
      status: sensorData.gps.status,
      subValue: `E ${sensorData.gps.lng.toFixed(4)}° • ±${sensorData.gps.accuracy}м`,
      description: "Глобальная система позиционирования — точность в метрах",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {sensors.map((sensor, index) => (
        <SensorCard key={sensor.label} {...sensor} index={index} />
      ))}
    </div>
  );
}
