
import { useState, useCallback } from 'react';
import { useFirestore } from '../firestore';
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

export const useLeaveAllocation = (employeeId: string) => {
  const [allocation, setAllocation] = useState<LeaveAllocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false); // Pour éviter les chargements répétés
  
  const { 
    search: searchAllocation,
    add: addAllocation,
    update: updateAllocation
  } = useFirestore<LeaveAllocation>('hr_leave_allocations');

  const fetchAllocation = useCallback(async () => {
    // Si nous avons déjà chargé les allocations et que l'ID est inchangé, ne pas recharger
    if (!employeeId || (hasLoaded && allocation !== null)) {
      setLoading(false);
      return allocation;
    }

    setLoading(true);
    try {
      // Récupérer l'allocation pour l'année en cours
      const currentYear = new Date().getFullYear();
      const result = await searchAllocation('employeeId', employeeId);
      
      let currentAllocation = result.docs?.find(doc => doc.year === currentYear);
      
      if (currentAllocation) {
        setAllocation(currentAllocation);
        setHasLoaded(true); // Marquer comme chargé
        return currentAllocation;
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
          const newAllocationId = await addAllocation(defaultAllocation);
          
          if (newAllocationId !== null) {
            const allocationId = typeof newAllocationId === 'string' 
              ? newAllocationId 
              : (newAllocationId as any).id || String(newAllocationId);
              
            const newAllocation = { ...defaultAllocation, id: allocationId };
            setAllocation(newAllocation);
            setHasLoaded(true); // Marquer comme chargé
            return newAllocation;
          }
        } catch (err) {
          console.error("Error creating allocation:", err);
        }
      }
      return null;
    } catch (err) {
      console.error("Error fetching leave allocations:", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les allocations de congés.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [employeeId, searchAllocation, addAllocation, allocation, hasLoaded]);

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

  return {
    allocation,
    loading,
    fetchAllocation,
    updateLeaveAllocation
  };
};
