import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { AppSidebar } from './AppSidebar';
import { useSensorData } from '@/hooks/useSensorData';
import { ProjectInfo } from '@/types/sensors';

const project: ProjectInfo = {
  name: 'Site Alpha-7',
  location: 'Pompeii, Italy',
  startDate: '2024-01-15',
};

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { sensors, systemStatus, blockSummaries } = useSensorData();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar project={project} systemStatus={systemStatus} />
      
      <div className="flex-1 flex overflow-hidden">
        <AppSidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
        
        <main className="flex-1 overflow-auto p-4">
          <Outlet context={{ sensors, systemStatus, blockSummaries }} />
        </main>
      </div>
    </div>
  );
}
