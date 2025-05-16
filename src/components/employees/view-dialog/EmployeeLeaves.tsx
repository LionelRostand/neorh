
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeeLeaves } from '@/hooks/useEmployeeLeaves';
import LeaveAllocationManager from "@/components/leaves/allocation/LeaveAllocationManager";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import NewLeaveRequestForm from "@/components/leaves/NewLeaveRequestForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

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

  // Force refetch on initial load to ensure we get the latest data
  useEffect(() => {
    if (employeeId) {
      console.log("EmployeeLeaves - initial force refetch for employee:", employeeId);
      refetch();
    }
  }, [employeeId, refetch]);

  // Log allocation data for debugging
  useEffect(() => {
    console.log("EmployeeLeaves - allocation data:", allocation);
    console.log("EmployeeLeaves - loading state:", allocationLoading);
  }, [allocation, allocationLoading]);

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
              <p className="text-gray-500">Aucune allocation de congés trouvée dans hr_leave_allocations.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique des demandes de congés */}
      {leaves && leaves.length > 0 && (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Historique des demandes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="w-full h-12" />
                <Skeleton className="w-full h-12" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>{leave.type}</TableCell>
                      <TableCell>
                        {leave.startDate} - {leave.endDate}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          leave.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leave.status === 'approved' ? 'Approuvé' : 
                           leave.status === 'rejected' ? 'Refusé' : 'En attente'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
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
