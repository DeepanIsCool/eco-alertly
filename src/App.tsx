
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useToastContext } from "@/contexts/toast";
import { setToastContext } from "@/utils/toast";
import { useEffect } from "react";
import Index from "./pages/Index";
import Report from "./pages/Report";
import Map from "./pages/Map";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ToastInitializer() {
  const toastContext = useToastContext();
  
  useEffect(() => {
    setToastContext(toastContext);
  }, [toastContext]);
  
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ToastProvider>
        <ToastInitializer />
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/report" element={<Report />} />
              <Route path="/map" element={<Map />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ToastProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
