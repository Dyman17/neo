import { NavLink } from "react-router-dom";
import { LayoutDashboard, Activity, Radar, Map, Cpu, Settings } from "lucide-react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/sensors", icon: Activity, label: "Sensors" },
  { path: "/radar", icon: Radar, label: "Radar" },
  { path: "/map", icon: Map, label: "Map" },
  { path: "/materials", icon: Cpu, label: "Materials" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-muted border-r border-border flex flex-col">
      <div className="h-16 flex items-center px-4 font-bold text-lg border-b border-border">ArchaeoScan</div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-accent hover:text-foreground">
            <item.icon className="w-5 h-5"/>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
