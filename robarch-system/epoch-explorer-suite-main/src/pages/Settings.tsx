import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Video,
  Radio,
  Palette,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SettingsState {
  videoStreamUrl: string;
  websocketUrl: string;
  websocketPort: string;
  theme: "dark" | "light" | "system";
  autoSave: boolean;
  showExplainMode: boolean;
  sensorRefreshRate: number;
}

const defaultSettings: SettingsState = {
  videoStreamUrl: "rtsp://192.168.1.100:8554/stream",
  websocketUrl: "127.0.0.1",
  websocketPort: "8080",
  theme: "dark",
  autoSave: true,
  showExplainMode: false,
  sensorRefreshRate: 2000,
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem("archaeo-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("archaeo-settings");
    if (saved) {
      const savedSettings = JSON.parse(saved);
      setHasChanges(JSON.stringify(settings) !== JSON.stringify(savedSettings));
    } else {
      setHasChanges(JSON.stringify(settings) !== JSON.stringify(defaultSettings));
    }
  }, [settings]);

  const saveSettings = () => {
    localStorage.setItem("archaeo-settings", JSON.stringify(settings));
    setIsSaved(true);
    setHasChanges(false);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem("archaeo-settings", JSON.stringify(defaultSettings));
    setHasChanges(false);
  };

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Настройки</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Конфигурация системы и подключений
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetSettings}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Сбросить</span>
          </button>
          <button
            onClick={saveSettings}
            disabled={!hasChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasChanges
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm">Сохранено</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="text-sm">Сохранить</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Video Stream */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="science-card"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Video className="w-4 h-4 text-status-info" />
            <span className="text-sm font-medium">Видеопоток</span>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                URL видеопотока (RTSP/HLS/WebRTC)
              </label>
              <input
                type="text"
                value={settings.videoStreamUrl}
                onChange={(e) => updateSetting("videoStreamUrl", e.target.value)}
                placeholder="rtsp://192.168.1.100:8554/stream"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground/60 mt-1">
                Поддерживаются RTSP, HLS и WebRTC протоколы
              </p>
            </div>
          </div>
        </motion.div>

        {/* WebSocket */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="science-card"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Radio className="w-4 h-4 text-status-ok" />
            <span className="text-sm font-medium">WebSocket подключение</span>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Адрес сервера
                </label>
                <input
                  type="text"
                  value={settings.websocketUrl}
                  onChange={(e) => updateSetting("websocketUrl", e.target.value)}
                  placeholder="127.0.0.1"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Порт
                </label>
                <input
                  type="text"
                  value={settings.websocketPort}
                  onChange={(e) => updateSetting("websocketPort", e.target.value)}
                  placeholder="8080"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="status-dot status-dot-ok" />
              <span className="font-mono">ws://{settings.websocketUrl}:{settings.websocketPort}</span>
            </div>
          </div>
        </motion.div>

        {/* Display */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="science-card"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Palette className="w-4 h-4 text-status-ai" />
            <span className="text-sm font-medium">Отображение</span>
          </div>
          <div className="p-4 space-y-4">
            {/* Refresh Rate */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Частота обновления сенсоров
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="500"
                  value={settings.sensorRefreshRate}
                  onChange={(e) => updateSetting("sensorRefreshRate", Number(e.target.value))}
                  className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                />
                <span className="text-sm font-mono w-16 text-right">
                  {settings.sensorRefreshRate / 1000}с
                </span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm">Автосохранение</span>
                  <p className="text-xs text-muted-foreground">
                    Сохранять данные сеанса автоматически
                  </p>
                </div>
                <button
                  onClick={() => updateSetting("autoSave", !settings.autoSave)}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    settings.autoSave ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      settings.autoSave ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm">Режим объяснений</span>
                  <p className="text-xs text-muted-foreground">
                    Показывать подсказки для обучения
                  </p>
                </div>
                <button
                  onClick={() => updateSetting("showExplainMode", !settings.showExplainMode)}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    settings.showExplainMode ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      settings.showExplainMode ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </motion.div>

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="science-card"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <SettingsIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Информация о системе</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Версия</span>
                <span className="font-mono">2.4.1</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Сборка</span>
                <span className="font-mono">20240115</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">ИИ модель</span>
                <span className="font-mono">ArchaeoNet v2.4</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">База данных</span>
                <span className="font-mono">12,847 образцов</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
