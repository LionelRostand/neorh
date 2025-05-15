
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import ViewCompanyDialog from "./ViewCompanyDialog";
import EditCompanyDialog from "./EditCompanyDialog";
import DeleteCompanyDialog from "./DeleteCompanyDialog";

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
    if (onDetails) {
      onDetails(companyId);
    }
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

      {/* Dialogs */}
      {isViewOpen && (
        <ViewCompanyDialog
          companyId={companyId}
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
        />
      )}

      {isEditOpen && (
        <EditCompanyDialog
          companyId={companyId}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSuccess={onSuccess}
        />
      )}

      {isDeleteOpen && (
        <DeleteCompanyDialog
          companyId={companyId}
          companyName={companyName}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};

export default CompanyActions;
