
import React from "react";
import { Employee } from "@/types/employee";
import EmployeeAnniversaries from "@/components/dashboard/EmployeeAnniversaries";
import RecentAbsences from "@/components/dashboard/RecentAbsences";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import { Widget } from "./DashboardWidgetManager";

interface DashboardInfoCardsProps {
  employees: Employee[] | undefined;
  isLoading: boolean;
  widgets?: Widget[];
}

const DashboardInfoCards = ({ employees, isLoading, widgets = [] }: DashboardInfoCardsProps) => {
  const shouldShowAnniversaries = !widgets.length || 
    widgets.find(w => w.id === "employee-anniversaries")?.enabled !== false;
  
  const shouldShowAbsences = !widgets.length || 
    widgets.find(w => w.id === "recent-absences")?.enabled !== false;
  
  const shouldShowEvents = !widgets.length || 
    widgets.find(w => w.id === "upcoming-events")?.enabled !== false;

  const visibleWidgetsCount = [
    shouldShowAnniversaries,
    shouldShowAbsences,
    shouldShowEvents
  ].filter(Boolean).length;

  if (visibleWidgetsCount === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 
      ${visibleWidgetsCount === 1 ? 'lg:grid-cols-1' : ''} 
      ${visibleWidgetsCount === 2 ? 'lg:grid-cols-2' : ''} 
      ${visibleWidgetsCount === 3 ? 'lg:grid-cols-3' : ''} 
      gap-4 mb-6`}
    >
      {shouldShowAnniversaries && (
        <EmployeeAnniversaries employees={employees} isLoading={isLoading} />
      )}
      
      {shouldShowAbsences && (
        <RecentAbsences />
      )}
      
      {shouldShowEvents && (
        <UpcomingEvents />
      )}
    </div>
  );
};

export default DashboardInfoCards;
