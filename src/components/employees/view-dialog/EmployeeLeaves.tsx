
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeeLeaves } from '@/hooks/useEmployeeLeaves';
import LeaveAllocationManager from "@/components/leaves/allocation/LeaveAllocationManager";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import NewLeaveRequestForm from "@/components/leaves/NewLeaveRequestForm";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaveHistory } from '@/components/leaves/history/LeaveHistory';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmployeeLeavesProps {
  employeeId: string;
}

const EmployeeLeaves: React.FC<EmployeeLeavesProps> = ({ employeeId }) => {
  const [showLeaveRequestForm, setShowLeaveRequestForm] = useState(false);
  const { 
    allocation, 
    allocationLoading, 
    updateLeaveAllocation,
    leaves,
    loading,
    refetch
  } = useEmployeeLeaves(employeeId);

  // Force refetch on mount and when employeeId changes
  useEffect(() => {
    if (employeeId) {
      console.log("EmployeeLeaves - initial force refetch for employee:", employeeId);
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        refetch();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [employeeId, refetch]);

  // Log data for debugging
  useEffect(() => {
    console.log("EmployeeLeaves - allocation data:", allocation);
    console.log("EmployeeLeaves - loading state:", allocationLoading);
    console.log("EmployeeLeaves - leaves data:", leaves);
  }, [allocation, allocationLoading, leaves]);

  const handleLeaveRequestSuccess = () => {
    refetch();
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return dateString;
    }
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
          {allocationLoading ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
          ) : allocation ? (
            <LeaveAllocationManager 
              allocation={allocation}
              isLoading={allocationLoading}
              onUpdate={updateLeaveAllocation}
              employeeId={employeeId}
            />
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">Aucune allocation de congés trouvée. Cliquez sur "Nouvelle demande" pour en créer une.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique des demandes de congés */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="w-full h-56" />
        </div>
      ) : (
        <LeaveHistory 
          leaves={leaves || []} 
          formatDate={formatDate} 
        />
      )}

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
