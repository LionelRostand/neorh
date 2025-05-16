
import { useState, useEffect } from "react";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { useCollection } from "@/hooks/useCollection";
import { Leave } from "@/lib/constants";
import NewLeaveRequestForm from "@/components/leaves/NewLeaveRequestForm";
import LeavesHeader from "@/components/leaves/LeavesHeader";
import LeavesContent from "@/components/leaves/LeavesContent";

const Conges = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  const { getAll, isLoading, error } = useCollection<'hr_leaves'>();

  useEffect(() => {
    fetchLeaves();
  }, []);

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
          status: doc.status || ''
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

  const handleApprove = (id: string) => {
    showSuccessToast("Demande approuvée");
  };

  const handleReject = (id: string) => {
    showErrorToast("Demande refusée");
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
      />
    </div>
  );
};

export default Conges;
