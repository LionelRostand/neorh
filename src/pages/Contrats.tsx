
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";

// Custom hooks
import useContractsList from "@/hooks/contracts/useContractsList";

// Components
import ContractsHeader from "@/components/contracts/page/ContractsHeader";
import ContractStatusCards from "@/components/contracts/ContractStatusCards";
import ContractsListCard from "@/components/contracts/page/ContractsListCard";
import ContractDialogs from "@/components/contracts/page/ContractDialogs";

const Contrats = () => {
  // State for dialogs
  const [newContractDialogOpen, setNewContractDialogOpen] = useState(false);
  const [viewContractId, setViewContractId] = useState<string | null>(null);
  const [editContractId, setEditContractId] = useState<string | null>(null);
  const [deleteContractId, setDeleteContractId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Use contract data hook
  const { 
    contracts, 
    loading, 
    fetchContracts, 
    handleDeleteContract, 
    getStatusCounts 
  } = useContractsList();

  // UI handlers
  const handleNewContract = () => {
    setNewContractDialogOpen(true);
  };

  const handleDetails = (id: string) => {
    setViewContractId(id);
  };

  const handleEdit = (id: string) => {
    setEditContractId(id);
    toast({
      title: "Modifier",
      description: `Modification du contrat ${id}`
    });
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteContractId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteContractId) return;
    await handleDeleteContract(deleteContractId);
  };

  // Get status counts
  const countByStatus = getStatusCounts();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <ContractsHeader onNewContract={handleNewContract} />

      <ContractStatusCards
        total={countByStatus.total}
        active={countByStatus.active}
        pending={countByStatus.pending}
        expired={countByStatus.expired}
      />

      <ContractsListCard 
        contracts={contracts}
        loading={loading}
        onRefresh={fetchContracts}
        onDetails={handleDetails}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <ContractDialogs
        newContractOpen={newContractDialogOpen}
        setNewContractOpen={setNewContractDialogOpen}
        viewContractId={viewContractId}
        setViewContractId={setViewContractId}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        deleteContractId={deleteContractId}
        onDeleteConfirm={handleDeleteConfirm}
        onContractsRefresh={fetchContracts}
      />
    </div>
  );
};

export default Contrats;
