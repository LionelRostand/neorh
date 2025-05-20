
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Employes from "./pages/Employes";
import Badges from "./pages/Badges";
import Contrats from "./pages/Contrats";
import Hierarchie from "./pages/Hierarchie";
import FeuillesDeTemps from "./pages/FeuillesDeTemps";
import Presences from "./pages/Presences";
import Conges from "./pages/Conges";
import Rapports from "./pages/Rapports";
import Formations from "./pages/Formations";
import Parametres from "./pages/Parametres";
import Evaluations from "./pages/Evaluations";
import DocumentsRH from "./pages/DocumentsRH";
import Entreprises from "./pages/Entreprises";
import Departements from "./pages/Departements";
import Salaires from "./pages/Salaires";
import Recrutement from "./pages/Recrutement";
import Projets from "./pages/Projets";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import WeeklyProjectsTimesheet from "./components/timesheet/weekly-timesheet/WeeklyProjectsTimesheet";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }>
          <Route index element={<Index />} />
          <Route path="employes" element={<Employes />} />
          <Route path="badges" element={<Badges />} />
          <Route path="contrats" element={<Contrats />} />
          <Route path="hierarchie" element={<Hierarchie />} />
          <Route path="feuilles-de-temps" element={<FeuillesDeTemps />} />
          <Route path="projets" element={<Projets />} />
          <Route path="presences" element={<Presences />} />
          <Route path="conges" element={<Conges />} />
          <Route path="rapports" element={<Rapports />} />
          <Route path="formations" element={<Formations />} />
          <Route path="parametres" element={<Parametres />} />
          <Route path="evaluations" element={<Evaluations />} />
          <Route path="documents" element={<DocumentsRH />} />
          <Route path="entreprises" element={<Entreprises />} />
          <Route path="departements" element={<Departements />} />
          <Route path="salaires" element={<Salaires />} />
          <Route path="recrutement" element={<Recrutement />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
