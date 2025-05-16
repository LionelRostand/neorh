
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Leave } from "@/lib/constants";

interface LeaveTableProps {
  leaves: Leave[];
  loading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const LeaveTable = ({ leaves, loading, onApprove, onReject }: LeaveTableProps) => {
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

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return "-";
    if (!endDate || startDate === endDate) {
      return `${startDate} - 0 jour`;
    }
    return `${startDate} - ${endDate}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employé</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Période</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Demande</TableHead>
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
          <>
            {/* Exemple de ligne pour la démo */}
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <span>?</span>
                  </div>
                  <div>
                    <div className="font-medium">Employé inconnu</div>
                    <div className="text-xs text-gray-500">Non spécifié</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>Congés payés</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>- 0 jour</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge("pending")}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 h-8" onClick={() => onApprove("1")}>
                    <Check className="h-4 w-4 mr-1" /> Approuver
                  </Button>
                  <Button variant="ghost" className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 h-8" onClick={() => onReject("1")}>
                    <X className="h-4 w-4 mr-1" /> Refuser
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </>
        )}
      </TableBody>
    </Table>
  );
};

export default LeaveTable;
