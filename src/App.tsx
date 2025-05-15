
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Employes from "./pages/Employes";
import Badges from "./pages/Badges";
import Hierarchie from "./pages/Hierarchie";
import FeuillesDeTemps from "./pages/FeuillesDeTemps";
import Presences from "./pages/Presences";
import Conges from "./pages/Conges";
import Contrats from "./pages/Contrats";
import DocumentsRH from "./pages/DocumentsRH";
import Departements from "./pages/Departements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/employes" element={<Layout><Employes /></Layout>} />
          <Route path="/badges" element={<Layout><Badges /></Layout>} />
          <Route path="/hierarchie" element={<Layout><Hierarchie /></Layout>} />
          <Route path="/feuilles-de-temps" element={<Layout><FeuillesDeTemps /></Layout>} />
          <Route path="/presences" element={<Layout><Presences /></Layout>} />
          <Route path="/conges" element={<Layout><Conges /></Layout>} />
          <Route path="/contrats" element={<Layout><Contrats /></Layout>} />
          <Route path="/documents" element={<Layout><DocumentsRH /></Layout>} />
          <Route path="/departements" element={<Layout><Departements /></Layout>} />
          {/* D'autres routes pour les sections RH seront ajoutées ici */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
