
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { LeaveAllocation } from '@/hooks/useEmployeeLeaves';
import { useAuth } from '@/hooks/useAuth';
import AllocationCounter from './AllocationCounter';
import ConfirmDialog from './ConfirmDialog';
import ManagerActions from './ManagerActions';
import LoadingSkeleton from './LoadingSkeleton';
import { LeaveAllocationManagerProps } from './types';

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
  const canEdit = Boolean((user?.isAdmin) || (user?.role === 'manager'));

  const handleSave = async () => {
    if (!allocation) return;
    
    setIsSaving(true);
    const success = await onUpdate({
      paidLeavesTotal,
      rttTotal,
      updatedBy: user?.uid
    });
    
    if (success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const resetForm = () => {
    setPaidLeavesTotal(allocation?.paidLeavesTotal || 25);
    setRttTotal(allocation?.rttTotal || 12);
    setIsEditing(false);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Allocation de congés</CardTitle>
        <CardDescription>
          Gérer les jours de congés disponibles pour l'année {allocation?.year || new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <AllocationCounter
              id="paidLeaves"
              value={paidLeavesTotal}
              onChange={setPaidLeavesTotal}
              isEditing={isEditing}
              label="Congés payés disponibles"
              used={allocation?.paidLeavesUsed || 0}
              total={allocation?.paidLeavesTotal || 25}
              colorClass="bg-blue-100 text-blue-800"
            />

            <AllocationCounter
              id="rtt"
              value={rttTotal}
              onChange={setRttTotal}
              isEditing={isEditing}
              label="RTT disponibles"
              used={allocation?.rttUsed || 0}
              total={allocation?.rttTotal || 12}
              colorClass="bg-amber-100 text-amber-800"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {canEdit && (
          <>
            <ConfirmDialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
              onConfirm={handleSave}
              isSaving={isSaving}
            />
            
            {isEditing ? (
              <ManagerActions
                isEditing={isEditing}
                isSaving={isSaving}
                onSave={handleSave}
                onCancel={resetForm}
                setShowConfirmDialog={setShowConfirmDialog}
                showConfirmDialog={showConfirmDialog}
              />
            ) : (
              <ManagerActions
                isEditing={isEditing}
                isSaving={isSaving}
                onSave={handleSave}
                onCancel={resetForm}
                setShowConfirmDialog={() => setIsEditing(true)}
                showConfirmDialog={showConfirmDialog}
              />
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default LeaveAllocationManager;
