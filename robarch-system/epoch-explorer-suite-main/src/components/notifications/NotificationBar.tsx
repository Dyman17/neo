import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, AlertTriangle, CheckCircle, Info, Cpu } from "lucide-react";

type NotificationType = "success" | "warning" | "info" | "ai";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "GPS синхронизирован",
    message: "Точность позиционирования: ±0.5м",
    timestamp: new Date(),
  },
  {
    id: "2",
    type: "ai",
    title: "ИИ обнаружение",
    message: "Обнаружен потенциальный артефакт в секторе B-7",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "3",
    type: "warning",
    title: "Низкий заряд батареи",
    message: "Зонд #2: 23% заряда",
    timestamp: new Date(Date.now() - 300000),
  },
];

const typeConfig = {
  success: { icon: CheckCircle, color: "text-status-ok", bg: "bg-status-ok/10" },
  warning: { icon: AlertTriangle, color: "text-status-warning", bg: "bg-status-warning/10" },
  info: { icon: Info, color: "text-status-info", bg: "bg-status-info/10" },
  ai: { icon: Cpu, color: "text-status-ai", bg: "bg-status-ai/10" },
};

export function NotificationBar() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isExpanded, setIsExpanded] = useState(false);

  const latestNotification = notifications[0];
  const Icon = latestNotification ? typeConfig[latestNotification.type].icon : Bell;
  const config = latestNotification ? typeConfig[latestNotification.type] : typeConfig.info;

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`p-1.5 rounded-md ${config.bg}`}>
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>
            {latestNotification && (
              <span className="text-muted-foreground hidden sm:inline">
                {latestNotification.title}
              </span>
            )}
          </motion.button>
          
          {notifications.length > 1 && (
            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
              +{notifications.length - 1}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
          <span className="hidden md:inline">
            {new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="status-dot status-dot-ok" />
            <span className="hidden sm:inline">ONLINE</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
              {notifications.map((notification, index) => {
                const ItemIcon = typeConfig[notification.type].icon;
                const itemConfig = typeConfig[notification.type];
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border"
                  >
                    <div className={`p-1.5 rounded-md ${itemConfig.bg}`}>
                      <ItemIcon className={`w-4 h-4 ${itemConfig.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {notification.message}
                      </p>
                    </div>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
