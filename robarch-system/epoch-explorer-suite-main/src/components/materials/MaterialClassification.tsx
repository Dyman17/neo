import { motion } from "framer-motion";
import { Cpu, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MaterialPrediction {
  id: string;
  name: string;
  confidence: number;
  color: string;
}

const mockPredictions: MaterialPrediction[] = [
  { id: "1", name: "Камень (известняк)", confidence: 72, color: "status-ok" },
  { id: "2", name: "Глина", confidence: 18, color: "status-info" },
  { id: "3", name: "Металл (бронза)", confidence: 7, color: "status-warning" },
  { id: "4", name: "Органика", confidence: 3, color: "status-ai" },
];

export function MaterialClassification() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="science-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-status-ai/10">
            <Cpu className="w-4 h-4 text-status-ai" />
          </div>
          <span className="text-sm font-medium">ИИ-классификация</span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 hover:bg-muted rounded transition-colors">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-xs">
              Вероятность основана на анализе текстуры, плотности и отражения сигнала
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="p-4 space-y-4">
        {mockPredictions.map((prediction, index) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-foreground">{prediction.name}</span>
              <span className={`font-mono text-sm text-${prediction.color}`}>
                {prediction.confidence}%
              </span>
            </div>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prediction.confidence}%` }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className={`progress-fill progress-fill-${prediction.color.split("-")[1]}`}
              />
            </div>
          </motion.div>
        ))}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-4"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Скрыть детали
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              Показать детали анализа
            </>
          )}
        </button>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="pt-3 border-t border-border text-xs text-muted-foreground space-y-2"
          >
            <p>• Метод: Машинное обучение (CNN + Random Forest)</p>
            <p>• Выборка: 12,847 образцов</p>
            <p>• Точность модели: 94.2%</p>
            <p>• Последнее обновление: 2 сек. назад</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
