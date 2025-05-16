
import { useState, useEffect, useCallback } from 'react';
import { Leave } from '@/lib/constants';
import { useFirestore } from './useFirestore';
import { toast } from '@/components/ui/use-toast';

export interface LeaveAllocation {
  id?: string;
  employeeId: string;
  year: number;
  paidLeavesTotal: number;
  paidLeavesUsed: number;
  rttTotal: number;
  rttUsed: number;
  updatedAt: string;
  updatedBy?: string;
}

export const useEmployeeLeaves = (employeeId: string) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const [allocation, setAllocation] = useState<LeaveAllocation | null>(null);
  const [allocationLoading, setAllocationLoading] = useState(true);
  
  const { search } = useFirestore<Leave>('hr_leaves');
  const { 
    search: searchAllocation,
    add: addAllocation,
    update: updateAllocation
  } = useFirestore<LeaveAllocation>('hr_leave_allocations');

  // Utiliser useCallback pour mémoriser la fonction fetchEmployeeLeaves
  const fetchEmployeeLeaves = useCallback(async () => {
    if (!employeeId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching leaves for employee:", employeeId);
      
      // Effectuer la recherche par employeeId sans options de tri
      const result = await search('employeeId', employeeId);
      console.log("Leaves result:", result);
      
      if (result.docs) {
        // Tri manuel des résultats par date de début décroissante
        const sortedLeaves = [...result.docs].sort((a, b) => {
          if (!a.startDate || !b.startDate) return 0;
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
        
        setLeaves(sortedLeaves);
        
        // Calculate total leave days
        const total = sortedLeaves.reduce((acc, leave) => {
          if (leave.startDate && leave.endDate && leave.status === 'approved') {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day
            return acc + diffDays;
          }
          return acc;
        }, 0);
        
        setTotalDays(total);
      }
    } catch (err) {
      console.error("Error fetching employee leaves:", err);
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      toast({
        title: "Erreur",
        description: "Impossible de charger les congés de l'employé.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [employeeId, search]);

  // Charger les allocations de congés pour l'employé
  const fetchAllocation = useCallback(async () => {
    if (!employeeId) {
      setAllocationLoading(false);
      return;
    }

    setAllocationLoading(true);
    try {
      // Récupérer l'allocation pour l'année en cours
      const currentYear = new Date().getFullYear();
      const result = await searchAllocation('employeeId', employeeId);
      
      let currentAllocation = result.docs?.find(doc => doc.year === currentYear);
      
      if (currentAllocation) {
        setAllocation(currentAllocation);
      } else {
        // Créer une allocation par défaut si elle n'existe pas
        const defaultAllocation: Omit<LeaveAllocation, 'id'> = {
          employeeId,
          year: currentYear,
          paidLeavesTotal: 25, // Valeur par défaut en France
          paidLeavesUsed: 0,
          rttTotal: 12, // Valeur par défaut (à adapter)
          rttUsed: 0,
          updatedAt: new Date().toISOString()
        };
        
        try {
          // Résolution du problème de type
          const newAllocationId = await addAllocation(defaultAllocation);
          
          // Vérifier si l'ID est une chaîne ou un objet
          if (newAllocationId !== null) {
            const allocationId = typeof newAllocationId === 'string' 
              ? newAllocationId 
              : (newAllocationId as any).id || String(newAllocationId);
              
            setAllocation({ ...defaultAllocation, id: allocationId });
          }
        } catch (err) {
          console.error("Error creating allocation:", err);
        }
      }
    } catch (err) {
      console.error("Error fetching leave allocations:", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les allocations de congés.",
        variant: "destructive"
      });
    } finally {
      setAllocationLoading(false);
    }
  }, [employeeId, searchAllocation, addAllocation]);

  // Mettre à jour les allocations de congés
  const updateLeaveAllocation = useCallback(async (updates: Partial<LeaveAllocation>) => {
    if (!allocation?.id) return false;
    
    try {
      await updateAllocation(allocation.id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      // Mettre à jour l'état local
      setAllocation(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Succès",
        description: "Les allocations de congés ont été mises à jour.",
      });
      
      return true;
    } catch (err) {
      console.error("Error updating leave allocations:", err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les allocations de congés.",
        variant: "destructive"
      });
      return false;
    }
  }, [allocation, updateAllocation]);

  // Utiliser useEffect avec les dépendances correctes
  useEffect(() => {
    if (employeeId) {
      fetchEmployeeLeaves();
      fetchAllocation();
    }
  }, [employeeId, fetchEmployeeLeaves, fetchAllocation]);

  // Ajouter une fonction pour traduire les types de congés
  const getLeaveTypeLabel = (type: string): string => {
    switch (type) {
      case 'paid': return 'Congé payé';
      case 'rtt': return 'RTT';
      case 'sick': return 'Congé Maladie';
      case 'family': return 'Congé Familial';
      case 'maternity': return 'Congé Maternité';
      case 'paternity': return 'Congé Paternité';
      case 'annual': return 'Congé annuel';
      default: return type;
    }
  };

  return {
    leaves,
    loading,
    error,
    totalDays,
    allocation,
    allocationLoading,
    getLeaveTypeLabel,
    refetch: fetchEmployeeLeaves,
    updateLeaveAllocation
  };
};
