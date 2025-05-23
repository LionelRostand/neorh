
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useEmployeeStatusStats } from "@/hooks/useEmployeeStats";
import { useDashboardData } from "@/hooks/useDashboardData";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardInfoCards from "@/components/dashboard/DashboardInfoCards";
import DashboardModuleLinks from "@/components/dashboard/DashboardModuleLinks";

const Index = () => {
  const [filter, setFilter] = useState("tous");
  const { toast } = useToast();
  
  // Utiliser les hooks pour récupérer les données réelles
  const { employees, isLoading: isLoadingEmployees } = useEmployeeData();
  const employeeStats = useEmployeeStatusStats(employees);
  
  // Utiliser le hook pour récupérer les données du dashboard
  const { stats, moduleStats, isLoading } = useDashboardData(employees);

  const handleExport = () => {
    // Cette fonction sera implémentée plus tard pour exporter des données
    toast({
      title: "Export",
      description: "Fonctionnalité d'export à venir"
    });
  };

  return (
    <div className="p-4 md:p-6">
      <DashboardHeader handleExport={handleExport} />
      <DashboardStats stats={stats} isLoading={isLoading} />
      <DashboardCharts />
      <DashboardInfoCards employees={employees} isLoading={isLoadingEmployees} />
      <DashboardModuleLinks stats={moduleStats} />
    </div>
  );
};

export default Index;
