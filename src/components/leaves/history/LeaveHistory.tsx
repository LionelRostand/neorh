import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Leave } from '@/lib/constants';
import LeaveTypeBadge from '../badges/LeaveTypeBadge';
import LeaveStatusBadge from '../badges/LeaveStatusBadge';

interface LeaveHistoryProps {
  leaves: Leave[];
  formatDate: (date: string) => string;
}

const getDateDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day
};

const EmptyState = () => (
  <CardContent className="text-center py-10">
    <Calendar className="mx-auto h-10 w-10 text-gray-400" />
    <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun congé</h3>
    <p className="mt-1 text-sm text-gray-500">
      Aucun congé n'a été enregistré pour cet employé.
    </p>
  </CardContent>
);

const ErrorState = () => (
  <CardContent className="text-center py-10">
    <div className="text-red-500 mb-2">Une erreur est survenue lors du chargement des congés</div>
    <Button 
      variant="outline"
      onClick={() => window.location.reload()}
    >
      Réessayer
    </Button>
  </CardContent>
);

const LeaveHistoryTable: React.FC<{ leaves: Leave[], formatDate: (date: string) => string }> = ({ leaves, formatDate }) => (
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
);

const LeaveHistory: React.FC<LeaveHistoryProps> = ({ leaves, formatDate }) => {
  if (leaves.length === 0) {
    return (
      <Card className="border rounded-lg shadow-sm">
        <EmptyState />
      </Card>
    );
  }

  return (
    <Card className="border rounded-lg shadow-sm">
      <CardHeader className="bg-gray-50 pb-2">
        <CardTitle className="text-lg">Historique des congés</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <LeaveHistoryTable leaves={leaves} formatDate={formatDate} />
      </CardContent>
    </Card>
  );
};

export { LeaveHistory, ErrorState };
