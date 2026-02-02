import { SensorData } from '@/types/sensors';
import { SensorCard } from './SensorCard';
import { LucideIcon } from 'lucide-react';

interface SensorBlockProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  sensors: SensorData[];
  summaryCard: React.ReactNode;
}

export function SensorBlock({ title, icon: Icon, iconColor, sensors, summaryCard }: SensorBlockProps) {
  return (
    <div className="space-y-4">
      {/* Block Header */}
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded flex items-center justify-center ${iconColor}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sensor Cards */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {sensors.map((sensor) => (
              <SensorCard key={sensor.id} sensor={sensor} />
            ))}
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="lg:col-span-4">
          {summaryCard}
        </div>
      </div>
    </div>
  );
}
