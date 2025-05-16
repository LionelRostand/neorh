
import React, { useMemo } from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { LeaveAllocation } from '@/hooks/leaves';
import ManagerActions from '../ManagerActions';

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
  // Mémoriser la date de dernière mise à jour pour éviter les re-rendus
  const lastUpdatedDate = useMemo(() => {
    if (allocation?.updatedAt) {
      try {
        return new Date(allocation.updatedAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } catch (e) {
        return 'Date inconnue';
      }
    }
    return 'Jamais mise à jour';
  }, [allocation?.updatedAt]);

  return (
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl">
          Allocations de congés {new Date().getFullYear()}
        </CardTitle>
        {canEdit && (
          <ManagerActions
            isEditing={isEditing}
            isSaving={isSaving}
            onSave={onSave}
            onCancel={onCancel}
            setShowConfirmDialog={() => onSave()}
            showConfirmDialog={false}
          />
        )}
      </div>
      <p className="text-sm text-gray-500 mt-1">
        Dernière mise à jour: {lastUpdatedDate}
      </p>
    </CardHeader>
  );
};

export default AllocationHeader;
