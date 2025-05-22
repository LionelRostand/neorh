
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
    setLoading(true);
    try {
      const result = await badgesCollection.getAll();
      const data = result.docs || [];
      
      console.log("Badges récupérés depuis Firebase:", data);
      setBadges(data as Badge[]);
      calculateStats(data as Badge[]);
      
    } catch (error) {
      console.error("Erreur lors du chargement des badges:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les badges depuis Firebase",
        variant: "destructive"
      });
      // En cas d'erreur, initialiser avec un tableau vide
      setBadges([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const result = await employeesFirestore.getAll();
      if (result.docs) {
        console.log("Employés récupérés depuis Firebase:", result.docs);
        setEmployees(result.docs);
      } else {
        console.log("Aucun employé trouvé dans Firebase");
        setEmployees([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des employés:", error);
      setEmployees([]);
    }
  };

  const calculateStats = (badgeData: Badge[]) => {
    const active = badgeData.filter(b => b.status === 'active').length;
    const pending = badgeData.filter(b => b.status === 'pending').length;
    const inactive = badgeData.filter(b => b.status === 'inactive' || b.status === 'lost').length;
    
    // Calcul de couverture basé sur les employés actifs
    const coverage = employees.length > 0 ? Math.round((active / employees.length) * 100) : 0;
    
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
