
import { useState, useEffect } from 'react';
import { useCollection } from "@/hooks/useCollection";
import { useFirestore } from "@/hooks/firestore";
import { Badge, Employee } from "@/types/firebase";
import { toast } from "@/components/ui/use-toast";

export const useBadges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [badgeStats, setBadgeStats] = useState({
    active: 0,
    pending: 0,
    inactive: 0,
    coverage: 0
  });
  
  // Utilisation de notre hook pour accéder à la collection des badges
  const badgesCollection = useCollection("badges");
  
  // Utilisation du hook Firestore pour récupérer les employés
  const employeesFirestore = useFirestore<Employee>("employees");

  useEffect(() => {
    fetchBadges();
    fetchEmployees();
  }, []);

  const fetchBadges = async () => {
    try {
      const result = await badgesCollection.getAll();
      const data = result.docs || [];
      
      if (data.length === 0) {
        // Si aucun badge n'existe encore, utilisons des données fictives
        const mockBadges: Badge[] = [
          {
            id: "1",
            number: "B2023-001",
            employeeId: "1",
            employeeName: "Thomas Dubois",
            type: "standard",
            status: "active" as "active",
            issueDate: "15/03/2021",
            expiryDate: "15/03/2023"
          },
          {
            id: "2",
            number: "B2023-002",
            employeeId: "2",
            employeeName: "Sophie Martin",
            type: "admin",
            status: "pending" as "pending",
            issueDate: "02/05/2022",
            expiryDate: "02/05/2024"
          },
          {
            id: "3",
            number: "B2023-003",
            employeeId: "3",
            employeeName: "Jean Bernard",
            type: "standard",
            status: "inactive" as "inactive",
            issueDate: "10/11/2019",
            expiryDate: "10/11/2021"
          }
        ];
        setBadges(mockBadges);
        calculateStats(mockBadges);
      } else {
        setBadges(data as Badge[]);
        calculateStats(data as Badge[]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des badges:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les badges",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const result = await employeesFirestore.getAll();
      if (result.docs && result.docs.length > 0) {
        setEmployees(result.docs);
      } else {
        // Données fictives si aucun employé n'existe
        setEmployees([
          {
            id: "1",
            firstName: "Thomas",
            lastName: "Dubois",
            email: "thomas.dubois@example.com",
            phone: "0123456789",
            department: "IT",
            position: "Développeur",
            status: "active" as "active",
            hireDate: "10/01/2020"
          },
          {
            id: "2",
            firstName: "Sophie",
            lastName: "Martin",
            email: "sophie.martin@example.com",
            phone: "0123456790",
            department: "RH",
            position: "Responsable RH",
            status: "active" as "active",
            hireDate: "05/03/2019"
          }
        ]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des employés:", error);
    }
  };

  const calculateStats = (badgeData: Badge[]) => {
    const active = badgeData.filter(b => b.status === 'active').length;
    const pending = badgeData.filter(b => b.status === 'pending').length;
    const inactive = badgeData.filter(b => b.status === 'inactive' || b.status === 'lost').length;
    
    // Simulons un calcul de couverture (dans un cas réel, il faudrait comparer avec le nombre total d'employés)
    const coverage = badgeData.length > 0 ? Math.round((active / (employees.length || 2)) * 100) : 0;
    
    setBadgeStats({
      active,
      pending,
      inactive,
      coverage
    });
  };

  return {
    badges,
    employees,
    loading,
    badgeStats,
    fetchBadges,
    employeesFirestore
  };
};
