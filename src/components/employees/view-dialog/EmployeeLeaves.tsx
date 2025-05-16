
import React, { useState, useMemo, useCallback } from 'react';
import { useEmployeeLeaves } from '@/hooks/useEmployeeLeaves';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import NewLeaveRequestForm from '@/components/leaves/NewLeaveRequestForm';
import LeaveAllocationForm from '@/components/leaves/allocation/LeaveAllocationForm';
import LeaveAllocationManager from '@/components/leaves/allocation/LeaveAllocationManager';
import LoadingSkeleton from '@/components/leaves/allocation/LoadingSkeleton';
import LeaveSummaryCards from '@/components/leaves/summary/LeaveSummaryCards';
import { LeaveHistory, ErrorState } from '@/components/leaves/history/LeaveHistory';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

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
    updateLeaveAllocation
  } = useEmployeeLeaves(employeeId);
  
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  const [showNewAllocationForm, setShowNewAllocationForm] = useState(false);
  const { user } = useAuth();
  
  // Déterminer si l'utilisateur peut attribuer des congés (admin ou manager)
  const canAllocateLeaves = Boolean((user && user.isAdmin) || (user && user.role === 'manager'));
  
  const handleNewLeaveRequest = useCallback(() => {
    setShowNewLeaveForm(true);
  }, []);

  const handleNewAllocation = useCallback(() => {
    setShowNewAllocationForm(true);
  }, []);

  const handleRequestSuccess = useCallback(() => {
    setShowNewLeaveForm(false);
  }, []);

  const handleAllocationSuccess = useCallback(() => {
    setShowNewAllocationForm(false);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  }, []);

  // Calculer les valeurs dérivées une seule fois quand les dépendances changent
  const paidLeavesRemaining = useMemo(() => 
    allocation ? allocation.paidLeavesTotal - allocation.paidLeavesUsed : 0
  , [allocation]);

  const rttRemaining = useMemo(() => 
    allocation ? allocation.rttTotal - allocation.rttUsed : 0
  , [allocation]);

  // Si loading, afficher un placeholder plus stylisé
  if (loading && allocationLoading) {
    return <LoadingSkeleton />;
  }

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

      {!loading && !allocationLoading && (
        <>
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
        </>
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
