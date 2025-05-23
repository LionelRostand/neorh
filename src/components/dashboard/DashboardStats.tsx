
import React from "react";
import { Users, Clock, Calendar, Wallet } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { Widget } from "./DashboardWidgetManager";

interface DashboardStatsProps {
  stats: {
    totalEmployees: number;
    absencesThisMonth: number;
    hoursWorked: number;
    averageSalary: number;
  };
  isLoading: boolean;
  widgets?: Widget[];
}

const DashboardStats = ({ stats, isLoading, widgets = [] }: DashboardStatsProps) => {
  const shouldShowTotalEmployees = !widgets.length || 
    widgets.find(w => w.id === "total-employees")?.enabled !== false;
  
  const shouldShowAbsences = !widgets.length || 
    widgets.find(w => w.id === "absences-month")?.enabled !== false;
  
  const shouldShowHoursWorked = !widgets.length || 
    widgets.find(w => w.id === "hours-worked")?.enabled !== false;
  
  const shouldShowAverageSalary = !widgets.length || 
    widgets.find(w => w.id === "average-salary")?.enabled !== false;

  const visibleWidgetsCount = [
    shouldShowTotalEmployees,
    shouldShowAbsences,
    shouldShowHoursWorked,
    shouldShowAverageSalary
  ].filter(Boolean).length;

  if (visibleWidgetsCount === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 
      ${visibleWidgetsCount === 1 ? 'md:grid-cols-1' : ''} 
      ${visibleWidgetsCount === 2 ? 'md:grid-cols-2' : ''} 
      ${visibleWidgetsCount === 3 ? 'md:grid-cols-3' : ''} 
      ${visibleWidgetsCount === 4 ? 'md:grid-cols-4' : ''} 
      gap-4 mb-6`}
    >
      {shouldShowTotalEmployees && (
        <StatCard 
          title="Total employés" 
          value={isLoading ? "..." : stats.totalEmployees.toString()} 
          icon={<Users size={18} />} 
          trend={{ value: 4.2, positive: true }}
        />
      )}
      
      {shouldShowAbsences && (
        <StatCard 
          title="Absences ce mois" 
          value={isLoading ? "..." : stats.absencesThisMonth.toString()} 
          icon={<Calendar size={18} />} 
          trend={{ value: 1.8, positive: false }}
        />
      )}
      
      {shouldShowHoursWorked && (
        <StatCard 
          title="Heures travaillées" 
          value={isLoading ? "..." : stats.hoursWorked.toLocaleString()} 
          icon={<Clock size={18} />}
          trend={{ value: 2.1, positive: true }}
        />
      )}
      
      {shouldShowAverageSalary && (
        <StatCard 
          title="Coût salarial moyen" 
          value={isLoading ? "..." : `${stats.averageSalary.toLocaleString()} €`} 
          icon={<Wallet size={18} />}
          trend={{ value: 0.8, positive: true }}
        />
      )}
    </div>
  );
};

export default DashboardStats;
