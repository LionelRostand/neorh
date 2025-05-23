
import React from "react";
import { Employee } from "@/types/employee";
import EmployeeAnniversaries from "@/components/dashboard/EmployeeAnniversaries";
import RecentAbsences from "@/components/dashboard/RecentAbsences";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";

interface DashboardInfoCardsProps {
  employees: Employee[] | undefined;
  isLoading: boolean;
}

const DashboardInfoCards = ({ employees, isLoading }: DashboardInfoCardsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <EmployeeAnniversaries employees={employees} isLoading={isLoading} />
      <RecentAbsences />
      <UpcomingEvents />
    </div>
  );
};

export default DashboardInfoCards;
