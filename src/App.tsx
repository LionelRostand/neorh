
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
import Evaluations from "./pages/Evaluations";
import Formations from "./pages/Formations";
import Salaires from "./pages/Salaires";
import Recrutement from "./pages/Recrutement";
import Entreprises from "./pages/Entreprises";
import Rapports from "./pages/Rapports";
import Parametres from "./pages/Parametres";
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
          <Route path="/evaluations" element={<Layout><Evaluations /></Layout>} />
          <Route path="/formations" element={<Layout><Formations /></Layout>} />
          <Route path="/salaires" element={<Layout><Salaires /></Layout>} />
          <Route path="/recrutement" element={<Layout><Recrutement /></Layout>} />
          <Route path="/entreprises" element={<Layout><Entreprises /></Layout>} />
          <Route path="/rapports" element={<Layout><Rapports /></Layout>} />
          <Route path="/parametres" element={<Layout><Parametres /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
