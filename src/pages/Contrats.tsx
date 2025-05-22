
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";

// Custom hooks
import useContractsList from "@/hooks/contracts/useContractsList";

// Components
import ContractsHeader from "@/components/contracts/page/ContractsHeader";
import ContractStatusCards from "@/components/contracts/ContractStatusCards";
import ContractsListCard from "@/components/contracts/page/ContractsListCard";
import ContractDialogs from "@/components/contracts/page/ContractDialogs";
import { Contract } from "@/lib/constants";

const Contrats = () => {
  // State for dialogs
  const [newContractDialogOpen, setNewContractDialogOpen] = useState(false);
  const [viewContractId, setViewContractId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editContract, setEditContract] = useState<Contract | null>(null);
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
    const contractToEdit = contracts.find(c => c.id === id);
    if (contractToEdit) {
      setEditContract(contractToEdit);
      setEditDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Contrat introuvable: ${id}`
      });
    }
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
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        editContract={editContract}
      />
    </div>
  );
};

export default Contrats;
