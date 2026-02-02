import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Activity,
  Map,
  Cpu,
  Settings,
  Radio,
  Compass,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Панель управления", description: "Главный экран мониторинга" },
  { path: "/sensors", icon: Activity, label: "Сенсоры", description: "Данные датчиков в реальном времени" },
  { path: "/map", icon: Map, label: "Карта", description: "Геолокация и маркеры" },
  { path: "/materials", icon: Cpu, label: "Материалы", description: "ИИ-классификация объектов" },
  { path: "/settings", icon: Settings, label: "Настройки", description: "Конфигурация системы" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 lg:w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <span className="hidden lg:block font-semibold text-foreground tracking-tight">
            ArchaeoScan
          </span>
        </div>
      </div>

      {/* Connection Status */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="status-dot status-dot-ok" />
          <span className="hidden lg:block text-xs text-muted-foreground">
            Система активна
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Tooltip key={item.path} delayDuration={0}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full"
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}
                  <Icon className={`w-5 h-5 transition-colors duration-300 ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  }`} />
                  <span className="hidden lg:block text-sm font-medium">
                    {item.label}
                  </span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden">
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Signal indicator */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-primary animate-pulse-glow" />
          <span className="hidden lg:block text-xs font-mono text-muted-foreground">
            WS: 127.0.0.1:8080
          </span>
        </div>
      </div>
    </aside>
  );
}
