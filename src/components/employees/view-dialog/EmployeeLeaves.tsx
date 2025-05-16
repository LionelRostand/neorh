
import React, { useState, useMemo, useCallback } from 'react';
import { useEmployeeLeaves } from '@/hooks/useEmployeeLeaves';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import NewLeaveRequestForm from '@/components/leaves/NewLeaveRequestForm';
import LeaveAllocationManager from '@/components/leaves/allocation/LeaveAllocationManager';
import LoadingSkeleton from '@/components/leaves/allocation/LoadingSkeleton';
import LeaveSummaryCards from '@/components/leaves/summary/LeaveSummaryCards';
import { LeaveHistory, ErrorState } from '@/components/leaves/history/LeaveHistory';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import LeaveAllocationForm from '@/components/leaves/allocation/LeaveAllocationForm';

interface EmployeeLeavesProps {
  employee: Employee;
}

const EmployeeLeaves: React.FC<EmployeeLeavesProps> = ({ employee }) => {
  // Utilisation du hook avec un ID stable
  const employeeId = employee?.id || '';
  
  const { 
    leaves, 
    loading, 
    error, 
    totalDays, 
    getLeaveTypeLabel,
    allocation,
    allocationLoading,
    updateLeaveAllocation,
    refetch
  } = useEmployeeLeaves(employeeId);
  
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  const [showNewAllocationForm, setShowNewAllocationForm] = useState(false);
  const { user } = useAuth();
  
  // Déterminer si l'utilisateur peut attribuer des congés (admin ou manager)
  const canAllocateLeaves = Boolean((user && user.isAdmin) || (user && user.role === 'manager'));
  
  const handleNewLeaveRequest = () => {
    setShowNewLeaveForm(true);
  };

  const handleNewAllocation = () => {
    setShowNewAllocationForm(true);
  };

  const handleRequestSuccess = () => {
    setShowNewLeaveForm(false);
    refetch(); // Utiliser refetch pour mettre à jour les données
  };

  const handleAllocationSuccess = () => {
    setShowNewAllocationForm(false);
    refetch(); // Utiliser refetch pour mettre à jour les données
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Calculer les valeurs dérivées
  const paidLeavesRemaining = allocation ? allocation.paidLeavesTotal - allocation.paidLeavesUsed : 0;
  const rttRemaining = allocation ? allocation.rttTotal - allocation.rttUsed : 0;

  if (loading && !leaves.length) {
    return <LoadingSkeleton />;
  }

  // Même en cas de chargement, afficher un contenu minimal
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">Congés</h3>
        <div className="flex gap-2">
          {canAllocateLeaves && (
            <Button 
              variant="outline" 
              onClick={handleNewAllocation}
              className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 gap-2"
            >
              <Calendar className="h-4 w-4" /> Nouvelle attribution
            </Button>
          )}
          <Button 
            onClick={handleNewLeaveRequest}
            className="bg-emerald-500 hover:bg-emerald-600 gap-2"
          >
            <Plus className="h-4 w-4" /> Nouvelle demande
          </Button>
        </div>
      </div>

      {/* Toujours afficher le gestionnaire d'allocation pour éviter les erreurs de rendu */}
      <LeaveAllocationManager 
        allocation={allocation}
        isLoading={allocationLoading}
        onUpdate={updateLeaveAllocation}
        employeeId={employeeId}
      />

      <LeaveSummaryCards
        totalDays={totalDays}
        paidLeavesRemaining={paidLeavesRemaining}
        paidLeavesTotal={allocation?.paidLeavesTotal || 0}
        rttRemaining={rttRemaining}
        rttTotal={allocation?.rttTotal || 0}
      />

      {error ? (
        <Card className="border rounded-lg shadow-sm">
          <CardContent className="p-4 py-6">
            <ErrorState />
          </CardContent>
        </Card>
      ) : (
        <LeaveHistory 
          leaves={leaves} 
          formatDate={formatDate}
        />
      )}

      <NewLeaveRequestForm 
        open={showNewLeaveForm} 
        onClose={() => setShowNewLeaveForm(false)}
        onSuccess={handleRequestSuccess}
        employeeId={employeeId}
      />

      <LeaveAllocationForm
        open={showNewAllocationForm}
        onClose={() => setShowNewAllocationForm(false)}
        onSuccess={handleAllocationSuccess}
        employeeId={employeeId}
      />
    </div>
  );
};

export default EmployeeLeaves;
