
import React, { useState, useMemo, useCallback } from 'react';
import { useEmployeeLeaves } from '@/hooks/useEmployeeLeaves';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import NewLeaveRequestForm from '@/components/leaves/NewLeaveRequestForm';
import LeaveAllocationManager from '@/components/leaves/allocation/LeaveAllocationManager';
import LoadingSkeleton from '@/components/leaves/allocation/LoadingSkeleton';
import LeaveSummaryCards from '@/components/leaves/summary/LeaveSummaryCards';
import { LeaveHistory, ErrorState } from '@/components/leaves/history/LeaveHistory';
import { Card } from '@/components/ui/card';

interface EmployeeLeavesProps {
  employee: Employee;
}

const EmployeeLeaves: React.FC<EmployeeLeavesProps> = ({ employee }) => {
  const { 
    leaves, 
    loading, 
    error, 
    totalDays, 
    getLeaveTypeLabel,
    allocation,
    allocationLoading,
    updateLeaveAllocation
  } = useEmployeeLeaves(employee?.id || '');
  
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  
  const handleNewLeaveRequest = useCallback(() => {
    setShowNewLeaveForm(true);
  }, []);

  const handleRequestSuccess = useCallback(() => {
    setShowNewLeaveForm(false);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  }, []);

  // Only recalculate when allocation changes
  const paidLeavesRemaining = useMemo(() => 
    allocation ? allocation.paidLeavesTotal - allocation.paidLeavesUsed : 0
  , [allocation]);

  const rttRemaining = useMemo(() => 
    allocation ? allocation.rttTotal - allocation.rttUsed : 0
  , [allocation]);

  if (loading || allocationLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">Congés</h3>
        <Button 
          onClick={handleNewLeaveRequest}
          className="bg-emerald-500 hover:bg-emerald-600 gap-2"
        >
          <Plus className="h-4 w-4" /> Nouvelle demande
        </Button>
      </div>

      <LeaveAllocationManager 
        allocation={allocation}
        isLoading={allocationLoading}
        onUpdate={updateLeaveAllocation}
        employeeId={employee.id}
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
          <ErrorState />
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
        employeeId={employee.id}
      />
    </div>
  );
};

export default EmployeeLeaves;
