
import React from "react";
import NewContractDialog from "@/components/contracts/NewContractDialog";
import ViewContractDialog from "@/components/contracts/ViewContractDialog";
import DeleteContractDialog from "@/components/contracts/DeleteContractDialog";

interface ContractDialogsProps {
  newContractOpen: boolean;
  setNewContractOpen: (open: boolean) => void;
  viewContractId: string | null;
  setViewContractId: (id: string | null) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  deleteContractId: string | null;
  onDeleteConfirm: () => void;
  onContractsRefresh: () => void;
}

const ContractDialogs: React.FC<ContractDialogsProps> = ({
  newContractOpen,
  setNewContractOpen,
  viewContractId,
  setViewContractId,
  deleteDialogOpen,
  setDeleteDialogOpen,
  deleteContractId,
  onDeleteConfirm,
  onContractsRefresh
}) => {
  return (
    <>
      <NewContractDialog 
        open={newContractOpen} 
        onOpenChange={setNewContractOpen}
        onSuccess={onContractsRefresh}
      />

      <ViewContractDialog 
        open={!!viewContractId}
        onClose={() => setViewContractId(null)}
        contractId={viewContractId}
      />

      <DeleteContractDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={onDeleteConfirm}
        contractId={deleteContractId}
      />
    </>
  );
};

export default ContractDialogs;
