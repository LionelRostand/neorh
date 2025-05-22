
import { useState, useEffect } from "react";
import { Contract } from "@/lib/constants";
import useFirestore from "@/hooks/useFirestore";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for managing contracts data and operations
 */
export const useContractsList = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore<Contract>('hr_contracts');

  // Fetch contracts
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const result = await firestore.getAll();
      if (result.docs) {
        const typedContracts = result.docs.map(doc => ({
          id: doc.id || '',
          employeeId: doc.employeeId || '',
          employeeName: doc.employeeName || 'Employé inconnu',
          position: doc.position || 'Non spécifié',
          type: doc.type || 'CDI',
          startDate: doc.startDate || '',
          endDate: doc.endDate || '',
          status: doc.status || 'draft',
          salary: doc.salary || '', // Make sure salary is included
          departmentId: doc.departmentId || '',
          departmentName: doc.departmentName || ''
        } as Contract));
        
        setContracts(typedContracts);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des contrats:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les contrats"
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a contract
  const handleDeleteContract = async (id: string) => {
    try {
      await firestore.remove(id);
      toast({
        title: "Suppression réussie",
        description: "Le contrat a été supprimé avec succès"
      });
      // Refresh contract list
      fetchContracts();
    } catch (error) {
      console.error("Erreur lors de la suppression du contrat:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le contrat"
      });
    }
  };

  // Count contracts by status
  const getStatusCounts = () => {
    return {
      active: contracts.filter(c => c.status === 'active').length,
      pending: contracts.filter(c => c.status === 'pending').length,
      expired: contracts.filter(c => c.status === 'expired').length,
      total: contracts.length
    };
  };

  // Initial fetch
  useEffect(() => {
    fetchContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    contracts,
    loading,
    fetchContracts,
    handleDeleteContract,
    getStatusCounts
  };
};

export default useContractsList;
