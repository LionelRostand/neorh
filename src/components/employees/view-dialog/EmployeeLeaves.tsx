
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeeLeaves } from '@/hooks/useEmployeeLeaves';
import LeaveAllocationManager from "@/components/leaves/allocation/LeaveAllocationManager";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import NewLeaveRequestForm from "@/components/leaves/NewLeaveRequestForm";

interface EmployeeLeavesProps {
  employeeId: string;
}

const EmployeeLeaves: React.FC<EmployeeLeavesProps> = ({ employeeId }) => {
  const [showLeaveRequestForm, setShowLeaveRequestForm] = useState(false);
  const { 
    allocation, 
    allocationLoading, 
    updateLeaveAllocation,
    refetch
  } = useEmployeeLeaves(employeeId);

  const handleLeaveRequestSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Congés</h3>
        <Button 
          variant="outline"
          className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          onClick={() => setShowLeaveRequestForm(true)}
        >
          <CalendarPlus className="h-4 w-4" /> Nouvelle demande
        </Button>
      </div>
      
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Allocations</CardTitle>
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

      {/* Formulaire de demande de congés */}
      <NewLeaveRequestForm 
        open={showLeaveRequestForm} 
        onClose={() => setShowLeaveRequestForm(false)}
        onSuccess={handleLeaveRequestSuccess}
        employeeId={employeeId}
        isAllocation={false}
      />
    </div>
  );
};

export default EmployeeLeaves;
