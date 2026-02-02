import { motion } from "framer-motion";
import { Cpu, HelpCircle, ChevronDown, ChevronUp, Scan, History, Download } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MaterialPrediction {
  id: string;
  name: string;
  confidence: number;
  colorClass: string;
}

interface ScanHistory {
  id: string;
  timestamp: Date;
  topMaterial: string;
  confidence: number;
  location: string;
}

const mockPredictions: MaterialPrediction[] = [
  { id: "1", name: "Камень (известняк)", confidence: 72, colorClass: "ok" },
  { id: "2", name: "Глина", confidence: 18, colorClass: "info" },
  { id: "3", name: "Металл (бронза)", confidence: 7, colorClass: "warning" },
  { id: "4", name: "Органика", confidence: 3, colorClass: "ai" },
];

const mockHistory: ScanHistory[] = [
  { id: "1", timestamp: new Date(), topMaterial: "Камень", confidence: 72, location: "A-12-3" },
  { id: "2", timestamp: new Date(Date.now() - 300000), topMaterial: "Глина", confidence: 85, location: "A-12-2" },
  { id: "3", timestamp: new Date(Date.now() - 600000), topMaterial: "Металл", confidence: 64, location: "A-12-1" },
  { id: "4", timestamp: new Date(Date.now() - 900000), topMaterial: "Камень", confidence: 91, location: "A-11-8" },
  { id: "5", timestamp: new Date(Date.now() - 1200000), topMaterial: "Органика", confidence: 78, location: "A-11-7" },
];

export default function Materials() {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [selectedScan, setSelectedScan] = useState<ScanHistory | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ИИ-классификация материалов</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Автоматическое определение состава находок
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-status-ai/20 text-status-ai rounded-lg hover:bg-status-ai/30 transition-colors">
            <Scan className="w-4 h-4" />
            <span className="text-sm font-medium">Новый анализ</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Analysis Panel */}
        <div className="xl:col-span-2 space-y-6">
          {/* Current Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="science-card"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-status-ai/10">
                  <Cpu className="w-4 h-4 text-status-ai" />
                </div>
                <span className="text-sm font-medium">Текущий анализ</span>
                <div className="flex items-center gap-1.5 ml-2">
                  <div className="status-dot status-dot-ai" />
                  <span className="text-xs font-mono text-muted-foreground">ОБРАБОТКА</span>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 hover:bg-muted rounded transition-colors">
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Нейросеть анализирует текстуру, плотность, спектральные характеристики и отражение сигнала для определения материала
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="p-6">
              {/* Visualization placeholder */}
              <div className="relative aspect-video bg-muted/30 rounded-lg mb-6 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-status-ai/10 flex items-center justify-center">
                      <Cpu className="w-12 h-12 text-status-ai animate-pulse" />
                    </div>
                    <p className="text-sm text-muted-foreground">Анализ образца</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Точка: A-12-3</p>
                  </div>
                </div>
                
                {/* Scanning overlay effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-status-ai to-transparent"
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4">
                {mockPredictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">{prediction.name}</span>
                      <span className={`font-mono text-sm text-status-${prediction.colorClass}`}>
                        {prediction.confidence}%
                      </span>
                    </div>
                    <div className="progress-bar h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence}%` }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        className={`progress-fill progress-fill-${prediction.colorClass}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Details Expand */}
              <div className="mt-6 pt-4 border-t border-border">
                <button
                  onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isDetailsExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      Скрыть технические детали
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      Показать технические детали
                    </>
                  )}
                </button>

                {isDetailsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-4 bg-muted/30 rounded-lg text-xs font-mono space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Модель:</span>
                      <span>ArchaeoNet v2.4 (CNN + RF)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Обучающая выборка:</span>
                      <span>12,847 образцов</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Точность модели:</span>
                      <span className="text-status-ok">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Время обработки:</span>
                      <span>0.847 сек</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Входные данные:</span>
                      <span>Пьезо, TDS, УЗ, Магнит</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* History Panel */}
        <div className="xl:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="science-card"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">История анализов</span>
              </div>
              <button className="p-1.5 hover:bg-muted rounded transition-colors">
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {mockHistory.map((scan, index) => (
                <motion.button
                  key={scan.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => setSelectedScan(scan)}
                  className={`w-full text-left p-4 border-b border-border last:border-b-0 transition-colors ${
                    selectedScan?.id === scan.id ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{scan.topMaterial}</span>
                    <span className="text-xs font-mono text-status-ok">{scan.confidence}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{scan.location}</span>
                    <span>
                      {scan.timestamp.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="science-card p-4"
          >
            <h4 className="text-sm font-medium mb-4">Статистика сеанса</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-mono text-status-ai">47</div>
                <div className="text-xs text-muted-foreground mt-1">Анализов</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-mono text-status-ok">82%</div>
                <div className="text-xs text-muted-foreground mt-1">Ср. уверенность</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-mono text-status-info">4</div>
                <div className="text-xs text-muted-foreground mt-1">Типа материалов</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-mono text-status-warning">12</div>
                <div className="text-xs text-muted-foreground mt-1">Артефактов</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
