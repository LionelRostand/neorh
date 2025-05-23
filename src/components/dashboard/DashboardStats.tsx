
import React from "react";
import { Users, Clock, Calendar, Wallet } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

interface DashboardStatsProps {
  stats: {
    totalEmployees: number;
    absencesThisMonth: number;
    hoursWorked: number;
    averageSalary: number;
  };
  isLoading: boolean;
}

const DashboardStats = ({ stats, isLoading }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total employés" 
        value={isLoading ? "..." : stats.totalEmployees.toString()} 
        icon={<Users size={18} />} 
        trend={{ value: 4.2, positive: true }}
      />
      <StatCard 
        title="Absences ce mois" 
        value={isLoading ? "..." : stats.absencesThisMonth.toString()} 
        icon={<Calendar size={18} />} 
        trend={{ value: 1.8, positive: false }}
      />
      <StatCard 
        title="Heures travaillées" 
        value={isLoading ? "..." : stats.hoursWorked.toLocaleString()} 
        icon={<Clock size={18} />}
        trend={{ value: 2.1, positive: true }}
      />
      <StatCard 
        title="Coût salarial moyen" 
        value={isLoading ? "..." : `${stats.averageSalary.toLocaleString()} €`} 
        icon={<Wallet size={18} />}
        trend={{ value: 0.8, positive: true }}
      />
    </div>
  );
};

export default DashboardStats;
