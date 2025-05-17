
import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTimesheets } from '@/hooks/useTimesheets';

// Helper function to format date
const formatDate = (date: string): string => {
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Date invalide';
  }
};

interface EmployeeTimesheetsProps {
  employeeId: string;
}

const EmployeeTimesheets: React.FC<EmployeeTimesheetsProps> = ({ employeeId }) => {
  console.log('EmployeeTimesheets component rendering for employeeId:', employeeId);
  
  // Use the useTimesheets hook for data fetching
  const { timesheets, isLoading, error } = useTimesheets(employeeId);
  
  console.log('Timesheets data:', { isLoading, error, count: timesheets?.length, data: timesheets });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Feuilles de temps</h3>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Feuilles de temps</h3>
        <div className="p-4 text-red-500 border border-red-300 rounded-md">
          Erreur: {error.message}
        </div>
      </div>
    );
  }

  if (!timesheets || timesheets.length === 0) {
    return (
      <div className="space-y-6 text-center py-10">
        <div className="flex justify-center">
          <FileText className="h-16 w-16 text-gray-300" />
        </div>
        <h3 className="text-xl font-semibold">Aucune feuille de temps</h3>
        <p className="text-gray-500">
          Aucune feuille de temps n'est disponible pour cet employé.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Feuilles de temps</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Période</TableHead>
            <TableHead>Projet</TableHead>
            <TableHead>Heures</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Soumis le</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheets.map((timesheet) => (
            <TableRow key={timesheet.id}>
              <TableCell>
                {timesheet.weekStartDate && timesheet.weekEndDate 
                  ? `${formatDate(timesheet.weekStartDate)} - ${formatDate(timesheet.weekEndDate)}` 
                  : 'Non défini'}
              </TableCell>
              <TableCell>{timesheet.projectId || 'Non assigné'}</TableCell>
              <TableCell>{timesheet.hours || 0}h</TableCell>
              <TableCell>
                <Badge 
                  variant={timesheet.status === 'approved' ? 'default' : 
                          timesheet.status === 'rejected' ? 'destructive' : 
                          'outline'}
                >
                  {timesheet.status === 'submitted' ? 'En attente' : 
                   timesheet.status === 'approved' ? 'Approuvé' : 
                   timesheet.status === 'rejected' ? 'Rejeté' : 'Brouillon'}
                </Badge>
              </TableCell>
              <TableCell>
                {timesheet.submittedAt ? formatDate(timesheet.submittedAt) : 'Non soumis'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTimesheets;
