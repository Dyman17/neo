import { motion } from "framer-motion";
import { VideoPlayer } from "@/components/dashboard/VideoPlayer";
import { SensorOverview } from "@/components/dashboard/SensorOverview";
import { RadarDisplay } from "@/components/radar/RadarDisplay";
import { MaterialClassification } from "@/components/materials/MaterialClassification";
import { MapPin, Clock, Layers } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Панель управления</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Обзор системы археологического сканирования
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="font-mono">Участок A-12</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-mono">Сеанс: 02:34:17</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Layers className="w-4 h-4" />
            <span className="font-mono">Глубина: 1.2м</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Video Player - Takes 2 columns on xl */}
        <div className="xl:col-span-2">
          <VideoPlayer />
        </div>

        {/* Radar Display */}
        <div className="xl:col-span-1">
          <RadarDisplay />
        </div>
      </div>

      {/* Sensors Section */}
      <div>
        <h2 className="text-lg font-medium mb-4">Данные сенсоров</h2>
        <SensorOverview />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Material Classification */}
        <MaterialClassification />

        {/* Quick Actions / Status */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="science-card p-4"
        >
          <h3 className="text-sm font-medium mb-4">Быстрые действия</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
              <div className="text-sm font-medium mb-1">Сохранить точку</div>
              <div className="text-xs text-muted-foreground">Добавить маркер на карту</div>
            </button>
            <button className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
              <div className="text-sm font-medium mb-1">Скриншот</div>
              <div className="text-xs text-muted-foreground">Захватить текущий кадр</div>
            </button>
            <button className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
              <div className="text-sm font-medium mb-1">Экспорт данных</div>
              <div className="text-xs text-muted-foreground">CSV / JSON формат</div>
            </button>
            <button className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
              <div className="text-sm font-medium mb-1">Калибровка</div>
              <div className="text-xs text-muted-foreground">Настройка сенсоров</div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
