import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Maximize2,
  Camera,
  Signal,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface VideoPlayerProps {
  streamUrl?: string;
}

export function VideoPlayer({ streamUrl = "" }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isConnected] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="science-card overflow-hidden"
    >
      {/* Video Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-elevated">
        <div className="flex items-center gap-3">
          <Camera className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Видеопоток</span>
          <div className="flex items-center gap-1.5 ml-2">
            <div className={`status-dot ${isConnected ? "status-dot-ok" : "status-dot-error"}`} />
            <span className="text-xs font-mono text-muted-foreground">
              {isConnected ? "LIVE" : "OFFLINE"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Signal className="w-3 h-3" />
          <span>1080p @ 30fps</span>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-black/50">
        {/* Placeholder for video - shows grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Center reticle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-32">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-primary/50" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-8 bg-primary/50" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-px bg-primary/50" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-px bg-primary/50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-primary/50 rounded-full" />
          </div>
        </div>

        {/* Overlay info */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2 py-1 bg-black/60 rounded text-xs font-mono">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white/80">REC</span>
          </div>
        </div>

        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 rounded text-xs font-mono text-white/80">
          {new Date().toLocaleTimeString("ru-RU")}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between text-xs font-mono text-white/60">
          <span>CAM-01</span>
          <span>N 55.7558° E 37.6173°</span>
        </div>

        {/* No stream message */}
        {!streamUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="text-center">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Нет видеопотока</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Настройте URL в разделе настроек
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-elevated border-t border-border">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>{isPlaying ? "Пауза" : "Воспроизведение"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>{isMuted ? "Включить звук" : "Выключить звук"}</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Настройки потока</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Полный экран</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
}
