import { motion } from "framer-motion";
import { LucideIcon, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type SensorStatus = "ok" | "warning" | "error" | "offline" | "loading";

interface SensorCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  status: SensorStatus;
  description?: string;
  subValue?: string;
  index?: number;
}

const statusStyles = {
  ok: { dot: "status-dot-ok", text: "text-status-ok" },
  warning: { dot: "status-dot-warning", text: "text-status-warning" },
  error: { dot: "status-dot-error", text: "text-status-error" },
  offline: { dot: "status-dot-offline", text: "text-status-offline" },
  loading: { dot: "status-dot-info", text: "text-status-info" },
};

export function SensorCard({
  icon: Icon,
  label,
  value,
  unit,
  status,
  description,
  subValue,
  index = 0,
}: SensorCardProps) {
  const styles = statusStyles[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05, 
        ease: [0.4, 0, 0.2, 1] 
      }}
      className="science-card p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-muted">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="data-label">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {description && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 hover:bg-muted rounded transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{description}</p>
              </TooltipContent>
            </Tooltip>
          )}
          <div className={`status-dot ${styles.dot}`} />
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-mono font-medium ${styles.text}`}>
          {status === "loading" ? "—" : value}
        </span>
        {unit && <span className="data-unit text-sm">{unit}</span>}
      </div>

      {subValue && (
        <p className="text-xs text-muted-foreground mt-2 font-mono">
          {subValue}
        </p>
      )}
    </motion.div>
  );
}
