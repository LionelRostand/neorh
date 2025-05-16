import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeeLeaves } from '@/hooks/useEmployeeLeaves';
import { Calendar } from 'lucide-react';
import LeaveAllocationManager from "@/components/leaves/allocation/LeaveAllocationManager";

interface EmployeeLeavesProps {
  employeeId: string;
}

const EmployeeLeaves: React.FC<EmployeeLeavesProps> = ({ employeeId }) => {
  const { 
    allocation, 
    allocationLoading, 
    updateLeaveAllocation,
    paidLeavesRemaining,
    paidLeavesTotal,
    rttRemaining,
    rttTotal
  } = useEmployeeLeaves(employeeId);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Congés</CardTitle>
      </CardHeader>
      <CardContent>
        <LeaveAllocationManager 
          allocation={allocation}
          isLoading={allocationLoading}
          onUpdate={updateLeaveAllocation}
          employeeId={employeeId}
        />
      </CardContent>
    </Card>
  );
};

export default EmployeeLeaves;
