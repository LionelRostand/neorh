
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, Clock, Calendar, Briefcase, Building2,
  LineChart, GraduationCap, Wallet, UserPlus,
  Network, Key, FolderOpen, Projector
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import EmployeeAnniversaries from "@/components/dashboard/EmployeeAnniversaries";
import RecentAbsences from "@/components/dashboard/RecentAbsences";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import EmployeeStatusChart from "@/components/dashboard/EmployeeStatusChart";
import DepartmentDistributionChart from "@/components/dashboard/DepartmentDistributionChart";
import DashboardModuleLinks from "@/components/dashboard/DashboardModuleLinks";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFirestore } from "@/hooks/useFirestore";
import { useToast } from "@/hooks/use-toast";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useEmployeeStatusStats } from "@/hooks/useEmployeeStats";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { HR } from "@/lib/constants/collections";

const Index = () => {
  const [filter, setFilter] = useState("tous");
  const [stats, setStats] = useState({
    totalEmployees: 0,
    absencesThisMonth: 0,
    hoursWorked: 0,
    averageSalary: 0
  });
  const { toast } = useToast();
  
  // Utiliser les hooks pour récupérer les données réelles
  const { employees, isLoading: isLoadingEmployees } = useEmployeeData();
  const employeeStats = useEmployeeStatusStats(employees);
  const employeesCollection = useFirestore('hr_employees');
  
  // State pour les autres modules
  const [documentsCount, setDocumentsCount] = useState(0);
  const [contractsCount, setContractsCount] = useState(0);
  const [leavesCount, setLeavesCount] = useState(0);
  const [timesheetsCount, setTimesheetsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer le nombre de documents
        const documentsQuery = query(collection(db, HR.DOCUMENTS || 'hr_documents'));
        const documentsSnapshot = await getDocs(documentsQuery);
        setDocumentsCount(documentsSnapshot.size);
        
        // Récupérer le nombre de contrats
        const contractsQuery = query(collection(db, HR.CONTRACTS || 'hr_contracts'));
        const contractsSnapshot = await getDocs(contractsQuery);
        setContractsCount(contractsSnapshot.size);
        
        // Récupérer le nombre de congés ce mois-ci
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const leavesQuery = query(
          collection(db, HR.LEAVES || 'hr_leaves'),
          where('startDate', '>=', firstDayOfMonth),
          where('startDate', '<=', lastDayOfMonth)
        );
        const leavesSnapshot = await getDocs(leavesQuery);
        setLeavesCount(leavesSnapshot.size);
        
        // Récupérer le nombre d'heures travaillées (feuilles de temps)
        const timesheetsQuery = query(
          collection(db, HR.TIMESHEETS || 'hr_timesheets'),
          where('weekStartDate', '>=', new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
        );
        const timesheetsSnapshot = await getDocs(timesheetsQuery);
        let totalHours = 0;
        timesheetsSnapshot.forEach(doc => {
          const data = doc.data();
          // Calculer le total des heures si la structure des données le permet
          if (data.days) {
            Object.values(data.days).forEach((day: any) => {
              if (typeof day.hours === 'number') {
                totalHours += day.hours;
              }
            });
          }
        });
        
        // Calculer le salaire moyen
        let totalSalary = 0;
        let employeesWithSalary = 0;
        
        if (employees && employees.length > 0) {
          for (const employee of employees) {
            if (employee.salary && typeof employee.salary === 'number') {
              totalSalary += employee.salary;
              employeesWithSalary++;
            }
          }
        }
        
        const averageSalary = employeesWithSalary > 0 ? Math.round(totalSalary / employeesWithSalary) : 0;
        
        // Mettre à jour les statistiques avec les données réelles
        setStats({
          totalEmployees: employees?.length || 0,
          absencesThisMonth: leavesCount,
          hoursWorked: Math.round(totalHours),
          averageSalary: averageSalary || 3256 // Valeur par défaut si pas de données
        });
        
      } catch (error) {
        console.error("Erreur lors du chargement des données du tableau de bord:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du tableau de bord",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (employees && employees.length > 0) {
      fetchDashboardData();
    }
  }, [employees, toast]);

  const handleNewEmployee = () => {
    // Cette fonction sera implémentée plus tard pour ajouter un nouvel employé
    toast({
      title: "Nouvel employé",
      description: "Formulaire d'ajout d'employé à venir"
    });
  };

  const handleExport = () => {
    // Cette fonction sera implémentée plus tard pour exporter des données
    toast({
      title: "Export",
      description: "Fonctionnalité d'export à venir"
    });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord</h1>
          <p className="text-gray-500">Bienvenue dans votre module de gestion des ressources humaines</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>Exporter</Button>
          <Link to="/employes">
            <Button size="sm" className="bg-hr hover:bg-hr-dark">
              <UserPlus className="mr-2 h-4 w-4" />
              Nouvel employé
            </Button>
          </Link>
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <EmployeeStatusChart />
        <DepartmentDistributionChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <EmployeeAnniversaries employees={employees} isLoading={isLoadingEmployees} />
        <RecentAbsences />
        <UpcomingEvents />
      </div>

      <DashboardModuleLinks stats={{
        employees: stats.totalEmployees,
        documents: documentsCount,
        contracts: contractsCount,
        leaves: leavesCount
      }} />
    </div>
  );
};

export default Index;
