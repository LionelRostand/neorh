
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Leave } from "@/lib/constants";
import { format, differenceInDays } from "date-fns";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LeaveTableProps {
  leaves: Leave[];
  loading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const LeaveTable = ({ leaves, loading, onApprove, onReject }: LeaveTableProps) => {
  const [employeeNames, setEmployeeNames] = useState<Record<string, string>>({});
  const [managerNames, setManagerNames] = useState<Record<string, string>>({});
  
  // Charger les noms des employés et des managers
  useEffect(() => {
    const fetchEmployeeAndManagerNames = async () => {
      const empIds = [...new Set(leaves.map(leave => leave.employeeId))];
      const mgrIds = [...new Set(leaves.map(leave => leave.managerId).filter(Boolean))];
      
      const empNamesMap: Record<string, string> = {};
      const mgrNamesMap: Record<string, string> = {};
      
      // Récupérer les noms des employés
      for (const empId of empIds) {
        try {
          const empDoc = await getDoc(doc(db, 'hr_employees', empId));
          if (empDoc.exists()) {
            const data = empDoc.data();
            empNamesMap[empId] = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          }
        } catch (err) {
          console.error(`Erreur lors du chargement de l'employé ${empId}:`, err);
        }
      }
      
      // Récupérer les noms des managers
      for (const mgrId of mgrIds) {
        if (!mgrId) continue;
        try {
          const mgrDoc = await getDoc(doc(db, 'hr_employees', mgrId));
          if (mgrDoc.exists()) {
            const data = mgrDoc.data();
            mgrNamesMap[mgrId] = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          }
        } catch (err) {
          console.error(`Erreur lors du chargement du manager ${mgrId}:`, err);
        }
      }
      
      setEmployeeNames(empNamesMap);
      setManagerNames(mgrNamesMap);
    };
    
    if (leaves.length > 0) {
      fetchEmployeeAndManagerNames();
    }
  }, [leaves]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Refusé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getLeaveTypeLabel = (type: string): string => {
    switch (type) {
      case 'paid': return 'Congé payé';
      case 'rtt': return 'RTT';
      case 'sick': return 'Congé Maladie';
      case 'family': return 'Congé Familial';
      case 'maternity': return 'Congé Maternité';
      case 'paternity': return 'Congé Paternité';
      case 'annual': return 'Congé annuel';
      default: return type;
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = differenceInDays(end, start) + 1; // +1 car on compte le jour de début

      const formattedStart = format(start, 'dd/MM/yyyy');
      const formattedEnd = format(end, 'dd/MM/yyyy');
      
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>
            {formattedStart} - {formattedEnd} ({days} jour{days > 1 ? 's' : ''})
          </span>
        </div>
      );
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>Dates non valides</span>
        </div>
      );
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employé</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Période</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Responsable</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10">Chargement...</TableCell>
          </TableRow>
        ) : leaves.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10">Aucune demande de congé trouvée</TableCell>
          </TableRow>
        ) : (
          leaves.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <span>
                      {employeeNames[leave.employeeId] ? 
                        employeeNames[leave.employeeId].charAt(0).toUpperCase() : 
                        leave.employeeId.substring(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {employeeNames[leave.employeeId] || leave.employeeId}
                    </div>
                    <div className="text-xs text-gray-500">{leave.employeeId}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getLeaveTypeLabel(leave.type)}</TableCell>
              <TableCell>
                {leave.startDate && leave.endDate 
                  ? formatDateRange(leave.startDate, leave.endDate)
                  : <span>Dates manquantes</span>
                }
              </TableCell>
              <TableCell>{getStatusBadge(leave.status)}</TableCell>
              <TableCell>
                {leave.managerId ? (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{managerNames[leave.managerId] || leave.managerId}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">Non assigné</span>
                )}
              </TableCell>
              <TableCell>
                {leave.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 h-8" onClick={() => onApprove(leave.id || '')}>
                      <Check className="h-4 w-4 mr-1" /> Approuver
                    </Button>
                    <Button variant="ghost" className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 h-8" onClick={() => onReject(leave.id || '')}>
                      <X className="h-4 w-4 mr-1" /> Refuser
                    </Button>
                  </div>
                )}
                {leave.status !== 'pending' && (
                  <span className="text-gray-400 text-sm">Action déjà effectuée</span>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default LeaveTable;
