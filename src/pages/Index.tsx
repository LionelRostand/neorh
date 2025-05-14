
import { useState } from "react";
import { 
  Users, Clock, Calendar, Briefcase, Building2,
  LineChart, GraduationCap, Wallet, UserPlus
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import EmployeeAnniversaries from "@/components/dashboard/EmployeeAnniversaries";
import RecentAbsences from "@/components/dashboard/RecentAbsences";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import EmployeeStatusChart from "@/components/dashboard/EmployeeStatusChart";
import DepartmentDistributionChart from "@/components/dashboard/DepartmentDistributionChart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [filter, setFilter] = useState("tous");

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord</h1>
          <p className="text-gray-500">Bienvenue dans votre module de gestion des ressources humaines</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm">Exporter</Button>
          <Button size="sm" className="bg-hr hover:bg-hr-dark">
            <UserPlus className="mr-2 h-4 w-4" />
            Nouvel employé
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total employés" 
          value="126" 
          icon={<Users size={18} />} 
          trend={{ value: 4.2, positive: true }}
        />
        <StatCard 
          title="Absences ce mois" 
          value="24" 
          icon={<Calendar size={18} />} 
          trend={{ value: 1.8, positive: false }}
        />
        <StatCard 
          title="Heures travaillées" 
          value="1,845" 
          icon={<Clock size={18} />}
          trend={{ value: 2.1, positive: true }}
        />
        <StatCard 
          title="Coût salarial moyen" 
          value="3,256 €" 
          icon={<Wallet size={18} />}
          trend={{ value: 0.8, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <EmployeeStatusChart />
        <DepartmentDistributionChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <EmployeeAnniversaries />
        <RecentAbsences />
        <UpcomingEvents />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">ACCÈS RAPIDES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="flex flex-col h-auto py-4 justify-center items-center">
                <Users className="h-5 w-5 mb-1" />
                <span className="text-xs">Employés</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 justify-center items-center">
                <Calendar className="h-5 w-5 mb-1" />
                <span className="text-xs">Congés</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 justify-center items-center">
                <Briefcase className="h-5 w-5 mb-1" />
                <span className="text-xs">Contrats</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 justify-center items-center">
                <Building2 className="h-5 w-5 mb-1" />
                <span className="text-xs">Départements</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 justify-center items-center">
                <LineChart className="h-5 w-5 mb-1" />
                <span className="text-xs">Évaluations</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 justify-center items-center">
                <GraduationCap className="h-5 w-5 mb-1" />
                <span className="text-xs">Formations</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
