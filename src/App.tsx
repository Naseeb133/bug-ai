import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { getTheme, setTheme } from "@/lib/store";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import ImagePage from "./pages/ImagePage";
import HistoryPage from "./pages/HistoryPage";
import UpgradePage from "./pages/UpgradePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    setTheme(getTheme());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/image" element={<ImagePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/upgrade" element={<UpgradePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
