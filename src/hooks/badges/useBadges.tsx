
import { useState, useEffect } from 'react';
import { useCollection } from "@/hooks/useCollection";
import { useFirestore } from "@/hooks/useFirestore";
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
  
  // Using the correct import for the useFirestore hook
  const badgesCollection = useCollection("hr_badges");
  
  // Also correct the collection name here
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
      
      console.log("Badges retrieved from Firebase:", data);
      setBadges(data as Badge[]);
      calculateStats(data as Badge[], employees);
      
    } catch (error) {
      console.error("Error loading badges:", error);
      toast({
        title: "Error",
        description: "Failed to load badges from Firebase",
        variant: "destructive"
      });
      setBadges([]);
      calculateStats([], employees);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const result = await employeesFirestore.getAll();
      if (result.docs) {
        console.log("Employees retrieved from Firebase:", result.docs);
        setEmployees(result.docs);
        // Recalculate stats when we have the employees
        if (badges.length > 0) {
          calculateStats(badges, result.docs);
        }
      } else {
        console.log("No employees found in Firebase");
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error loading employees:", error);
      setEmployees([]);
    }
  };

  const calculateStats = (badgeData: Badge[], employeeData: Employee[]) => {
    const active = badgeData.filter(b => b.status === 'active').length;
    const pending = badgeData.filter(b => b.status === 'pending').length;
    const inactive = badgeData.filter(b => b.status === 'inactive' || b.status === 'lost').length;
    
    // Coverage calculation based on active employees
    const coverage = employeeData.length > 0 ? Math.round((active / employeeData.length) * 100) : 0;
    
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
    fetchEmployees
  };
};
