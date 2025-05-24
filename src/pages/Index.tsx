
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useEmployeeStatusStats } from "@/hooks/useEmployeeStats";
import { useDashboardData } from "@/hooks/useDashboardData";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardInfoCards from "@/components/dashboard/DashboardInfoCards";
import DashboardModuleLinks from "@/components/dashboard/DashboardModuleLinks";
import DashboardWidgetManager, { Widget } from "@/components/dashboard/DashboardWidgetManager";

const DEFAULT_WIDGETS: Widget[] = [
  { id: "total-employees", title: "Nombre d'employés", type: "stat", enabled: true },
  { id: "absences-month", title: "Absences ce mois", type: "stat", enabled: true },
  { id: "hours-worked", title: "Heures travaillées", type: "stat", enabled: true },
  { id: "employee-status-chart", title: "Répartition par statut", type: "chart", enabled: true },
  { id: "department-distribution-chart", title: "Répartition par département", type: "chart", enabled: true },
  { id: "employee-anniversaries", title: "Anniversaires d'embauche", type: "info", enabled: true },
  { id: "recent-absences", title: "Absences récentes", type: "info", enabled: true },
  { id: "upcoming-events", title: "Événements à venir", type: "info", enabled: true }
];

const INDEX_KEY = "dashboard-widgets-config";

const Index = () => {
  const [filter, setFilter] = useState("tous");
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  
  // Utiliser les hooks pour récupérer les données réelles
  const { employees, isLoading: isLoadingEmployees } = useEmployeeData();
  const employeeStats = useEmployeeStatusStats(employees);
  
  // Utiliser le hook pour récupérer les données du dashboard
  const { stats, moduleStats, isLoading } = useDashboardData(employees);

  // Charger la configuration des widgets au démarrage
  useEffect(() => {
    const savedWidgets = localStorage.getItem(INDEX_KEY);
    
    if (savedWidgets) {
      try {
        const parsedWidgets = JSON.parse(savedWidgets);
        setWidgets(parsedWidgets);
      } catch (e) {
        console.error("Erreur lors du chargement de la configuration des widgets:", e);
      }
    }
  }, []);

  const handleExport = () => {
    // Cette fonction sera implémentée plus tard pour exporter des données
    toast({
      title: "Export",
      description: "Fonctionnalité d'export à venir"
    });
  };

  const handleWidgetsChange = (updatedWidgets: Widget[]) => {
    setWidgets(updatedWidgets);
    localStorage.setItem(INDEX_KEY, JSON.stringify(updatedWidgets));
    
    toast({
      title: "Configuration sauvegardée",
      description: "Les modifications de votre tableau de bord ont été enregistrées"
    });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <DashboardHeader handleExport={handleExport} />
        <DashboardWidgetManager 
          widgets={widgets} 
          onWidgetsChange={handleWidgetsChange} 
        />
      </div>
      
      <DashboardStats stats={stats} isLoading={isLoading} widgets={widgets} />
      <DashboardCharts widgets={widgets} />
      <DashboardInfoCards 
        employees={employees} 
        isLoading={isLoadingEmployees} 
        widgets={widgets} 
      />
      <DashboardModuleLinks stats={moduleStats} />
    </div>
  );
};

export default Index;
