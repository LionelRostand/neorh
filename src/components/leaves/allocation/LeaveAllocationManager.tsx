
import React, { useState, useEffect, memo } from 'react';
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

// Use memo to prevent unnecessary re-renders
const LeaveAllocationManager: React.FC<LeaveAllocationManagerProps> = memo(({
  allocation,
  isLoading,
  onUpdate,
  employeeId
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [paidLeavesTotal, setPaidLeavesTotal] = useState(0);
  const [rttTotal, setRttTotal] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Update local state when allocation changes
  useEffect(() => {
    if (allocation) {
      setPaidLeavesTotal(allocation.paidLeavesTotal);
      setRttTotal(allocation.rttTotal);
    }
  }, [allocation]);

  // Check if user is an administrator or manager
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
    if (allocation) {
      setPaidLeavesTotal(allocation.paidLeavesTotal);
      setRttTotal(allocation.rttTotal);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Card className="border rounded-lg shadow-sm mb-6">
      <CardHeader className="bg-gray-50 pb-3 border-b">
        <CardTitle className="text-xl">Allocation de congés</CardTitle>
        <CardDescription>
          Gérer les jours de congés disponibles pour l'année {allocation?.year || new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <AllocationCounter
              id="paidLeaves"
              value={paidLeavesTotal}
              onChange={setPaidLeavesTotal}
              isEditing={isEditing}
              label="Congés payés disponibles"
              used={allocation?.paidLeavesUsed || 0}
              total={paidLeavesTotal}
              colorClass="bg-blue-100 text-blue-800"
              iconBgClass="bg-green-100"
              iconColorClass="text-green-600"
            />

            <AllocationCounter
              id="rtt"
              value={rttTotal}
              onChange={setRttTotal}
              isEditing={isEditing}
              label="RTT disponibles"
              used={allocation?.rttUsed || 0}
              total={rttTotal}
              colorClass="bg-amber-100 text-amber-800"
              iconBgClass="bg-amber-100"
              iconColorClass="text-amber-600"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 px-6 pb-6">
        {canEdit && (
          <>
            <ConfirmDialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
              onConfirm={handleSave}
              isSaving={isSaving}
            />
            
            <ManagerActions
              isEditing={isEditing}
              isSaving={isSaving}
              onSave={handleSave}
              onCancel={resetForm}
              setShowConfirmDialog={isEditing ? setShowConfirmDialog : () => setIsEditing(true)}
              showConfirmDialog={showConfirmDialog}
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
});

LeaveAllocationManager.displayName = "LeaveAllocationManager";

export default LeaveAllocationManager;
