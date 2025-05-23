
import React from "react";
import EmployeeStatusChart from "@/components/dashboard/EmployeeStatusChart";
import DepartmentDistributionChart from "@/components/dashboard/DepartmentDistributionChart";

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <EmployeeStatusChart />
      <DepartmentDistributionChart />
    </div>
  );
};

export default DashboardCharts;
