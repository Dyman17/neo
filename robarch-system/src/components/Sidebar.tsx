import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Radar, 
  Map, 
  Cpu, 
  Settings,
  Wifi,
  WifiOff
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/sensors', icon: Activity, label: 'Sensors' },
  { path: '/radar', icon: Radar, label: 'Radar' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/materials', icon: Cpu, label: 'Materials' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  isConnected: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isConnected }) => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-16 lg:w-64 bg-white shadow-md z-10 flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold hidden lg:block">ArchaeoScan</h1>
        <div className="lg:hidden flex justify-center">
          <LayoutDashboard className="w-6 h-6" />
        </div>
      </div>
      
      <div className="p-3 border-b">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm hidden lg:block text-green-600">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="text-sm hidden lg:block text-red-600">Disconnected</span>
            </>
          )}
        </div>
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;