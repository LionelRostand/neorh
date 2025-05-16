
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar } from "lucide-react";
import { LeaveAllocation } from "@/hooks/useEmployeeLeaves";
import { LeaveAllocationManagerProps } from "./types";
import ManagerActions from "./ManagerActions";
import AllocationCounter from "./AllocationCounter";
import ConfirmDialog from "./ConfirmDialog";
import LoadingSkeleton from "./LoadingSkeleton";

const LeaveAllocationManager: React.FC<LeaveAllocationManagerProps> = ({
  allocation,
  isLoading,
  onUpdate,
  employeeId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Utiliser des états locaux pour suivre les changements pendant l'édition
  const [paidLeavesTotal, setPaidLeavesTotal] = useState(0);
  const [rttTotal, setRttTotal] = useState(0);
  
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
    // Restaurer les valeurs d'origine
    if (allocation) {
      setPaidLeavesTotal(allocation.paidLeavesTotal);
      setRttTotal(allocation.rttTotal);
    }
    setIsEditing(false);
  };

  const handleSave = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    if (!allocation) return;
    
    setIsSaving(true);
    try {
      // Ne mettre à jour que si les valeurs ont changé
      const updates: Partial<LeaveAllocation> = {};
      
      if (paidLeavesTotal !== allocation.paidLeavesTotal) {
        updates.paidLeavesTotal = paidLeavesTotal;
      }
      
      if (rttTotal !== allocation.rttTotal) {
        updates.rttTotal = rttTotal;
      }
      
      // N'envoyer la mise à jour que s'il y a des changements
      if (Object.keys(updates).length > 0) {
        const success = await onUpdate(updates);
        if (success) {
          setIsEditing(false);
        }
      } else {
        // Pas de changements, juste fermer le mode édition
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
      setShowConfirmDialog(false);
    }
  };

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

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!allocation) {
    return (
      <Card className="border rounded-lg shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="text-center py-4">
            <p className="text-gray-500">Aucune allocation de congés trouvée.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border rounded-lg shadow-sm mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Allocations de congés {new Date().getFullYear()}</CardTitle>
          <ManagerActions
            isEditing={isEditing}
            isSaving={isSaving}
            onSave={handleSave}
            onCancel={handleCancel}
            setShowConfirmDialog={setShowConfirmDialog}
            showConfirmDialog={showConfirmDialog}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Dernière mise à jour: {lastUpdatedDate}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AllocationCounter
            id="paid-leaves-total"
            value={paidLeavesTotal}
            onChange={setPaidLeavesTotal}
            isEditing={isEditing}
            label="Congés Payés"
            used={allocation.paidLeavesUsed}
            total={allocation.paidLeavesTotal}
            colorClass="text-blue-700"
            iconBgClass="bg-blue-100"
            iconColorClass="text-blue-600"
          />
          <AllocationCounter
            id="rtt-total"
            value={rttTotal}
            onChange={setRttTotal}
            isEditing={isEditing}
            label="RTT"
            used={allocation.rttUsed}
            total={allocation.rttTotal}
            colorClass="text-emerald-700"
            iconBgClass="bg-emerald-100"
            iconColorClass="text-emerald-600"
          />
        </div>
      </CardContent>
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirm}
        isSaving={isSaving}
      />
    </Card>
  );
};

export default LeaveAllocationManager;
