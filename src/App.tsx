
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
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
import Projets from "./pages/Projets";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <SonnerToaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout><Index /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/employes" element={
              <ProtectedRoute>
                <Layout><Employes /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/badges" element={
              <ProtectedRoute>
                <Layout><Badges /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/hierarchie" element={
              <ProtectedRoute>
                <Layout><Hierarchie /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/feuilles-de-temps" element={
              <ProtectedRoute>
                <Layout><FeuillesDeTemps /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/presences" element={
              <ProtectedRoute>
                <Layout><Presences /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/conges" element={
              <ProtectedRoute>
                <Layout><Conges /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/contrats" element={
              <ProtectedRoute>
                <Layout><Contrats /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute>
                <Layout><DocumentsRH /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/departements" element={
              <ProtectedRoute>
                <Layout><Departements /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/evaluations" element={
              <ProtectedRoute>
                <Layout><Evaluations /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/formations" element={
              <ProtectedRoute>
                <Layout><Formations /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/salaires" element={
              <ProtectedRoute>
                <Layout><Salaires /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/recrutement" element={
              <ProtectedRoute>
                <Layout><Recrutement /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/entreprises" element={
              <ProtectedRoute>
                <Layout><Entreprises /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/projets" element={
              <ProtectedRoute>
                <Layout><Projets /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/rapports" element={
              <ProtectedRoute>
                <Layout><Rapports /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/parametres" element={
              <ProtectedRoute>
                <Layout><Parametres /></Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={
              <ProtectedRoute>
                <Layout><NotFound /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
