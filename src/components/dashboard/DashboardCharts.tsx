
import React from "react";
import EmployeeStatusChart from "@/components/dashboard/EmployeeStatusChart";
import DepartmentDistributionChart from "@/components/dashboard/DepartmentDistributionChart";
import { Widget } from "./DashboardWidgetManager";

interface DashboardChartsProps {
  widgets?: Widget[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ widgets = [] }) => {
  const shouldShowEmployeeStatus = !widgets.length || 
    widgets.find(w => w.id === "employee-status-chart")?.enabled !== false;
  
  const shouldShowDepartmentDistribution = !widgets.length || 
    widgets.find(w => w.id === "department-distribution-chart")?.enabled !== false;

  if (!shouldShowEmployeeStatus && !shouldShowDepartmentDistribution) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {shouldShowEmployeeStatus && <EmployeeStatusChart />}
      {shouldShowDepartmentDistribution && <DepartmentDistributionChart />}
    </div>
  );
};

export default DashboardCharts;
