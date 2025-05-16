import React, { useState } from 'react';
import { useEmployeeLeaves } from '@/hooks/useEmployeeLeaves';
import { Employee } from '@/types/employee';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Check, X, Clock, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewLeaveRequestForm from '@/components/leaves/NewLeaveRequestForm';
import { format, differenceInDays } from 'date-fns';
import LeaveAllocationManager from '@/components/leaves/allocation/LeaveAllocationManager';

interface EmployeeLeavesProps {
  employee: Employee;
}

const LeaveTypeBadge = ({ type }: { type: string }) => {
  switch (type) {
    case 'paid':
    case 'annual':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Congés payés</Badge>;
    case 'rtt':
      return <Badge className="bg-green-100 text-green-800 border-green-300">RTT</Badge>;
    case 'sick':
      return <Badge className="bg-red-100 text-red-800 border-red-300">Maladie</Badge>;
    case 'maternity':
      return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Maternité</Badge>;
    case 'paternity':
      return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">Paternité</Badge>;
    case 'family':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-300">Familial</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Autre</Badge>;
  }
};

const LeaveStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'approved':
      return (
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-green-700">Approuvé</span>
        </div>
      );
    case 'rejected':
      return (
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span className="text-red-700">Refusé</span>
        </div>
      );
    case 'pending':
    default:
      return (
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
          <span className="text-yellow-700">En attente</span>
        </div>
      );
  }
};

const getDateDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day
};

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
  } = useEmployeeLeaves(employee.id);
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  
  console.log("Employee ID:", employee.id);
  console.log("Leave data in component:", leaves);
  console.log("Loading state:", loading);
  console.log("Error state:", error);
  
  // Calculer les congés restants à partir des allocations
  const paidLeavesRemaining = allocation 
    ? allocation.paidLeavesTotal - allocation.paidLeavesUsed
    : 25;

  const rttRemaining = allocation
    ? allocation.rttTotal - allocation.rttUsed
    : 12;

  const handleNewLeaveRequest = () => {
    setShowNewLeaveForm(true);
  };

  const handleRequestSuccess = () => {
    setShowNewLeaveForm(false);
    // Le hook useEmployeeLeaves sera rafraîchi automatiquement grâce à son useEffect
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold">Congés</h3>
        <Button 
          onClick={handleNewLeaveRequest}
          className="bg-emerald-500 hover:bg-emerald-600 gap-2"
        >
          <Plus className="h-4 w-4" /> Nouvelle demande
        </Button>
      </div>

      {/* Gestionnaire d'allocations de congés */}
      <LeaveAllocationManager 
        allocation={allocation}
        isLoading={allocationLoading}
        onUpdate={updateLeaveAllocation}
        employeeId={employee.id}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total jours pris</p>
                <h4 className="text-2xl font-bold">{totalDays}</h4>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Congés payés disponibles</p>
                <h4 className="text-2xl font-bold">{paidLeavesRemaining}</h4>
                <p className="text-xs text-gray-500">sur {allocation?.paidLeavesTotal || 25} jours</p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">RTT disponibles</p>
                <h4 className="text-2xl font-bold">{rttRemaining}</h4>
                <p className="text-xs text-gray-500">sur {allocation?.rttTotal || 12} jours</p>
              </div>
              <div className="p-2 rounded-full bg-amber-100">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : error ? (
        <div className="text-center py-10 border rounded-lg bg-red-50">
          <div className="text-red-500 mb-2">Une erreur est survenue lors du chargement des congés</div>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      ) : leaves.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-gray-50">
          <Calendar className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun congé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun congé n'a été enregistré pour cet employé.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Du</TableHead>
              <TableHead>Au</TableHead>
              <TableHead>Jours</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Motif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell><LeaveTypeBadge type={leave.type} /></TableCell>
                <TableCell>{formatDate(leave.startDate)}</TableCell>
                <TableCell>{formatDate(leave.endDate)}</TableCell>
                <TableCell>
                  {getDateDifference(leave.startDate, leave.endDate)}
                </TableCell>
                <TableCell><LeaveStatusBadge status={leave.status} /></TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {leave.comment || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
