
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LeaveAllocation } from '@/hooks/leaves';
import { Edit, Save, X, Loader2 } from 'lucide-react';

interface AllocationHeaderProps {
  allocation: LeaveAllocation;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  canEdit: boolean;
}

const AllocationHeader: React.FC<AllocationHeaderProps> = ({
  allocation,
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
  canEdit
}) => {
  const formattedDate = new Date(allocation.updatedAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div>
        <CardTitle className="text-lg">Allocations {allocation.year}</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Dernière mise à jour : {formattedDate}
        </p>
      </div>
      {canEdit && (
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className="gap-1"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Enregistrer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isSaving}
                className="gap-1"
              >
                <X className="h-4 w-4" />
                Annuler
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>
      )}
    </CardHeader>
  );
};

export default AllocationHeader;
