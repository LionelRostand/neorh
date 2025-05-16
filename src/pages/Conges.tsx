
import { useState, useEffect } from "react";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { useCollection } from "@/hooks/useCollection";
import { Leave } from "@/lib/constants";
import NewLeaveRequestForm from "@/components/leaves/NewLeaveRequestForm";
import LeavesHeader from "@/components/leaves/LeavesHeader";
import LeavesContent from "@/components/leaves/LeavesContent";
import { useAuth } from "@/hooks/useAuth"; // Supposons que ce hook existe pour récupérer l'utilisateur connecté

const Conges = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  const { getAll, isLoading, error, update, search } = useCollection<'hr_leaves'>();
  // const { user } = useAuth(); // Décommenter si vous avez un hook d'authentification

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      // Pour l'instant, récupère toutes les demandes
      // Dans un système réel, filtrer selon le rôle de l'utilisateur (employé vs manager)
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
          managerId: doc.managerId || ''
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

  const handleNewRequest = () => {
    setShowNewLeaveForm(true);
  };

  const handleRequestSuccess = () => {
    // Fermer le formulaire
    setShowNewLeaveForm(false);
    // Rafraîchir la liste des congés
    fetchLeaves();
  };

  const handleApprove = async (id: string) => {
    try {
      await update(id, { status: 'approved' });
      showSuccessToast("Demande approuvée");
      fetchLeaves(); // Actualiser la liste après mise à jour
    } catch (error) {
      console.error("Erreur lors de l'approbation de la demande:", error);
      showErrorToast("Impossible d'approuver la demande");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await update(id, { status: 'rejected' });
      showErrorToast("Demande refusée");
      fetchLeaves(); // Actualiser la liste après mise à jour
    } catch (error) {
      console.error("Erreur lors du refus de la demande:", error);
      showErrorToast("Impossible de refuser la demande");
    }
  };

  const handleSearch = (query: string) => {
    console.log("Recherche:", query);
    // Implement search functionality here
  };

  return (
    <div className="space-y-6">
      <LeavesHeader onNewRequest={handleNewRequest} />
      
      <LeavesContent 
        leaves={leaves}
        loading={loading}
        statusCounts={countByStatus}
        onApprove={handleApprove}
        onReject={handleReject}
        onSearch={handleSearch}
      />

      {/* Formulaire de nouvelle demande */}
      <NewLeaveRequestForm 
        open={showNewLeaveForm} 
        onClose={() => setShowNewLeaveForm(false)}
        onSuccess={handleRequestSuccess}
      />
    </div>
  );
};

export default Conges;
