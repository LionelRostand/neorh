
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import ViewCompanyDialog from "./ViewCompanyDialog";
import EditCompanyDialog from "./EditCompanyDialog";
import DeleteCompanyDialog from "./DeleteCompanyDialog";
import { toast } from "@/components/ui/use-toast";

interface CompanyActionsProps {
  companyId: string;
  companyName: string;
  onDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSuccess?: () => void;
}

const CompanyActions = ({ 
  companyId, 
  companyName,
  onDetails, 
  onEdit,
  onDelete,
  onSuccess
}: CompanyActionsProps) => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleView = () => {
    if (!companyId) {
      toast({
        title: "Erreur",
        description: "ID d'entreprise manquant",
        variant: "destructive"
      });
      return;
    }
    
    console.log("CompanyActions: Ouverture de la vue détaillée de l'entreprise:", companyId);
    
    if (onDetails) {
      onDetails(companyId);
    }
    
    // Assurons-nous que la boîte de dialogue est marquée comme ouverte
    setIsViewOpen(true);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(companyId);
    }
    setIsEditOpen(true);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(companyId);
    }
    setIsDeleteOpen(true);
  };

  const handleActionSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  // Gestionnaire de changement d'état de la boîte de dialogue
  const handleViewOpenChange = (open: boolean) => {
    console.log("CompanyActions: Changement d'état de la boîte de dialogue de visualisation:", open);
    setIsViewOpen(open);
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2 border-gray-200 hover:bg-gray-50 hover:text-gray-900" 
          onClick={handleView}
        >
          <Eye className="h-4 w-4 mr-1" /> Voir
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700" 
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4 mr-1" /> Modifier
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2 border-red-200 hover:bg-red-50 hover:text-red-700" 
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Supprimer
        </Button>
      </div>

      {/* Utiliser isViewOpen pour conditionner le rendu de la boîte de dialogue */}
      <ViewCompanyDialog
        companyId={companyId}
        open={isViewOpen}
        onOpenChange={handleViewOpenChange}
      />

      {isEditOpen && (
        <EditCompanyDialog
          companyId={companyId}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSuccess={handleActionSuccess}
        />
      )}

      {isDeleteOpen && (
        <DeleteCompanyDialog
          companyId={companyId}
          companyName={companyName}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onSuccess={handleActionSuccess}
        />
      )}
    </>
  );
};

export default CompanyActions;
