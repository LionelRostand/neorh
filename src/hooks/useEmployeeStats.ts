
import { useState, useEffect } from 'react';
import { useFirestore } from './firestore';
import { toast } from '@/components/ui/use-toast';

export const useEmployeeStats = () => {
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { getAll } = useFirestore('hr_employees');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getAll();
        
        if (result.docs && result.docs.length > 0) {
          // Process data for monthly view
          const monthlyData = processMonthlyData(result.docs);
          setEmployeeData(monthlyData);
        } else {
          // Use sample data if no results
          setEmployeeData([
            { name: 'Jan', actif: 45, inactif: 12 },
            { name: 'Fév', actif: 48, inactif: 10 },
            { name: 'Mar', actif: 52, inactif: 8 },
            { name: 'Avr', actif: 55, inactif: 7 },
            { name: 'Mai', actif: 58, inactif: 7 },
            { name: 'Jun', actif: 60, inactif: 8 },
          ]);
        }
      } catch (err) {
        console.error("Error fetching employee stats:", err);
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les statistiques des employés",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return { employeeData, isLoading, error };
};

// Helper function to process monthly data
const processMonthlyData = (employees: any[]) => {
  // Create a map to store active/inactive employees per month
  const monthlyStats: Record<string, { actif: number, inactif: number }> = {
    'Jan': { actif: 0, inactif: 0 },
    'Fév': { actif: 0, inactif: 0 },
    'Mar': { actif: 0, inactif: 0 },
    'Avr': { actif: 0, inactif: 0 },
    'Mai': { actif: 0, inactif: 0 },
    'Jun': { actif: 0, inactif: 0 },
  };
  
  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Process each employee
  employees.forEach(employee => {
    // Get hire date (assuming it's stored as a string in format YYYY-MM-DD)
    const hireDate = employee.hireDate ? new Date(employee.hireDate) : null;
    
    if (hireDate) {
      // Only consider employees hired this year for this simple example
      if (hireDate.getFullYear() === currentYear) {
        const monthIndex = hireDate.getMonth();
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        const monthName = monthNames[monthIndex];
        
        // Only update months we're displaying
        if (monthName in monthlyStats) {
          const isActive = employee.status === 'active';
          if (isActive) {
            monthlyStats[monthName].actif++;
          } else {
            monthlyStats[monthName].inactif++;
          }
        }
      }
    }
  });
  
  // Convert to array format for charts
  return Object.entries(monthlyStats).map(([name, stats]) => ({
    name,
    actif: stats.actif,
    inactif: stats.inactif
  }));
};
