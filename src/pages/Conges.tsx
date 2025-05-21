
import { useState, useEffect } from "react";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { useCollection } from "@/hooks/useCollection";
import { Leave } from "@/types/firebase"; // Using the firebase type consistently
import LeavesHeader from "@/components/leaves/LeavesHeader";
import LeavesContent from "@/components/leaves/LeavesContent";
import { useAuth } from "@/hooks/useAuth";
import { useLeaveApproval } from "@/hooks/leaves/useLeaveApproval";

const Conges = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAll, isLoading, error, update, search } = useCollection("leaves");
  const { user } = useAuth();
  const { approveLeave, rejectLeave } = useLeaveApproval();

  // Déterminer si l'utilisateur peut attribuer des congés (admin ou manager)
  const canAllocateLeaves = Boolean((user && user.isAdmin) || (user && user.role === 'manager'));

  // Utiliser un useEffect avec une dépendance vide pour éviter les boucles
  useEffect(() => {
    fetchLeaves();
  }, []); // <-- Tableau de dépendances vide pour exécuter une seule fois

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const result = await getAll();
      if (result.docs) {
        // Ensure we map the data to match the Leave type
        const typedLeaves = result.docs.map(doc => ({
          id: doc.id || '',
          employeeId: doc.employeeId || '',
          type: doc.type || '',
          startDate: doc.startDate || '',
          endDate: doc.endDate || '',
          status: doc.status || '',
          comment: doc.comment || '',
          managerId: doc.managerId || '',
          paidDaysAllocated: doc.paidDaysAllocated || 0,
          rttDaysAllocated: doc.rttDaysAllocated || 0,
          paidDaysUsed: doc.paidDaysUsed || 0,
          rttDaysUsed: doc.rttDaysUsed || 0,
          daysRequested: doc.daysRequested || 0
        } as Leave));
        
        setLeaves(typedLeaves);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des congés:", error);
      showErrorToast("Impossible de charger les demandes de congés");
    } finally {
      setLoading(false);
    }
  };

  // Compter les congés par statut
  const countByStatus = {
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
    total: leaves.length
  };

  const handleSuccess = () => {
    // Rafraîchir la liste des congés
    fetchLeaves();
    showSuccessToast("Opération réalisée avec succès");
  };

  const handleApprove = async (id: string) => {
    const success = await approveLeave(id);
    if (success) {
      fetchLeaves(); // Actualiser la liste après mise à jour
    }
  };

  const handleReject = async (id: string) => {
    const success = await rejectLeave(id);
    if (success) {
      fetchLeaves(); // Actualiser la liste après mise à jour
    }
  };

  const handleSearch = async (query: string) => {
    console.log("Recherche:", query);
    setLoading(true);
    try {
      if (!query || query.trim() === '') {
        // Si la requête est vide, charger toutes les demandes
        fetchLeaves();
        return;
      }
      
      // Recherche simple par employeeId (peut être améliorée)
      const result = await search('employeeId', query);
      if (result?.docs) {
        setLeaves(result.docs as Leave[]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      showErrorToast("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <LeavesHeader 
        onNewRequest={handleSuccess} 
        onNewAllocation={canAllocateLeaves ? handleSuccess : undefined}
      />
      
      <LeavesContent 
        leaves={leaves}
        loading={loading}
        statusCounts={countByStatus}
        onApprove={handleApprove}
        onReject={handleReject}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default Conges;
