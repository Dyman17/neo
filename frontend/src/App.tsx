import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Sensors } from "@/pages/Sensors";
import MapViewNew from '@/pages/MapViewNew';
import MaterialsNew from '@/pages/MaterialsNew';
import CameraStreamNew from '@/pages/CameraStreamNew';
import { SettingsReal } from '@/pages/SettingsReal';
import { PreservationAnalysis } from '@/pages/PreservationAnalysis';

import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<MapViewNew />} />
              <Route path="/sensors" element={<Sensors />} />
              <Route path="/map" element={<MapViewNew />} />
              <Route path="/materials" element={<MaterialsNew />} />
              <Route path="/camera" element={<CameraStreamNew />} />
              <Route path="/settings" element={<SettingsReal />} />
              <Route path="/analysis" element={<PreservationAnalysis />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
