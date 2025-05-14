
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Employes from "./pages/Employes";
import Badges from "./pages/Badges";
import Hierarchie from "./pages/Hierarchie";
import FeuillesDeTemps from "./pages/FeuillesDeTemps";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/employes" element={<Layout><Employes /></Layout>} />
          <Route path="/badges" element={<Layout><Badges /></Layout>} />
          <Route path="/hierarchie" element={<Layout><Hierarchie /></Layout>} />
          <Route path="/feuilles-de-temps" element={<Layout><FeuillesDeTemps /></Layout>} />
          {/* D'autres routes pour les sections RH seront ajoutées ici */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
