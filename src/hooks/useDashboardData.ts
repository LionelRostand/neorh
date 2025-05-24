
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Employee } from "@/types/employee";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HR } from "@/lib/constants/collections";

interface DashboardStats {
  totalEmployees: number;
  absencesThisMonth: number;
  hoursWorked: number;
  averageSalary: number;
}

interface ModuleStats {
  employees: number;
  documents: number;
  contracts: number;
  leaves: number;
  [key: string]: number; // Adding index signature to fix the TypeScript error
}

export const useDashboardData = (employees: Employee[] | undefined) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    absencesThisMonth: 0,
    hoursWorked: 0,
    averageSalary: 0
  });
  
  const [moduleStats, setModuleStats] = useState<ModuleStats>({
    employees: 0,
    documents: 0,
    contracts: 0,
    leaves: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer le nombre de documents
        const documentsQuery = query(collection(db, HR.DOCUMENTS || 'hr_documents'));
        const documentsSnapshot = await getDocs(documentsQuery);
        const documentsCount = documentsSnapshot.size;
        
        // Récupérer le nombre de contrats
        const contractsQuery = query(collection(db, HR.CONTRACTS || 'hr_contracts'));
        const contractsSnapshot = await getDocs(contractsQuery);
        const contractsCount = contractsSnapshot.size;
        
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
        const leavesCount = leavesSnapshot.size;
        
        // Récupérer le nombre d'heures travaillées (feuilles de temps)
        const timesheetsQuery = query(
          collection(db, HR.TIMESHEET || 'hr_timesheet'),
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
        
        // Mettre à jour les statistiques avec les données réelles
        setStats({
          totalEmployees: employees?.length || 0,
          absencesThisMonth: leavesCount,
          hoursWorked: Math.round(totalHours),
          averageSalary: 0 // Retiré le calcul du salaire moyen
        });
        
        setModuleStats({
          employees: employees?.length || 0,
          documents: documentsCount,
          contracts: contractsCount,
          leaves: leavesCount
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
  }, [employees]);

  return {
    stats,
    moduleStats,
    isLoading
  };
};
