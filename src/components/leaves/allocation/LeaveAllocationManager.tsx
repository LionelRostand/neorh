
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LeaveAllocation } from '@/hooks/leaves'; 
import { useAuth } from '@/hooks/useAuth';
import AllocationHeader from './components/AllocationHeader';
import AllocationContent from './components/AllocationContent';
import AllocationFooter from './components/AllocationFooter';
import ConfirmDialog from './ConfirmDialog';

interface LeaveAllocationManagerProps {
  allocation: LeaveAllocation | null;
  isLoading: boolean;
  onUpdate: (updates: Partial<LeaveAllocation>) => Promise<boolean>;
  employeeId: string;
}

const LeaveAllocationManager: React.FC<LeaveAllocationManagerProps> = ({
  allocation,
  isLoading,
  onUpdate,
  employeeId
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [paidLeavesTotal, setPaidLeavesTotal] = useState(allocation?.paidLeavesTotal || 25);
  const [rttTotal, setRttTotal] = useState(allocation?.rttTotal || 12);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Vérifier si l'utilisateur est un administrateur ou un manager
  const canEdit = Boolean((user && user.isAdmin) || (user && user.role === 'manager'));

  // Réinitialiser les valeurs éditées lorsque l'allocation change
  useEffect(() => {
    if (allocation) {
      setPaidLeavesTotal(allocation.paidLeavesTotal);
      setRttTotal(allocation.rttTotal);
    }
  }, [allocation]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (allocation) {
      setPaidLeavesTotal(allocation.paidLeavesTotal);
      setRttTotal(allocation.rttTotal);
    }
    setIsEditing(false);
    setShowConfirmDialog(false);
  };

  const handleSave = async () => {
    if (!allocation) return;
    
    setIsSaving(true);
    try {
      const updates: Partial<LeaveAllocation> = {
        paidLeavesTotal,
        rttTotal
      };
      
      // Seulement ajouter updatedBy s'il est défini
      if (user?.uid) {
        updates.updatedBy = user.uid;
      }
      
      const success = await onUpdate(updates);
      
      if (success) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
      setShowConfirmDialog(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border rounded-lg shadow-sm">
        <div className="p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!allocation) {
    return (
      <Card className="border rounded-lg shadow-sm">
        <div className="p-6 text-center">
          <p className="text-gray-500">Aucune allocation de congés trouvée.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border rounded-lg shadow-sm mb-6">
      <AllocationHeader 
        allocation={allocation}
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={handleEdit}
        onSave={() => setShowConfirmDialog(true)}
        onCancel={handleCancel}
        canEdit={canEdit}
      />
      
      <AllocationContent 
        allocation={allocation}
        isEditing={isEditing}
        paidLeavesTotal={paidLeavesTotal}
        rttTotal={rttTotal}
        setPaidLeavesTotal={setPaidLeavesTotal}
        setRttTotal={setRttTotal}
      />
      
      <AllocationFooter 
        isEditing={isEditing}
        isSaving={isSaving}
        onSave={() => setShowConfirmDialog(true)}
        onCancel={handleCancel}
        canEdit={canEdit}
      />

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleSave}
        isSaving={isSaving}
      />
    </Card>
  );
};

export default LeaveAllocationManager;
