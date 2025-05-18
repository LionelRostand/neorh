
import React, { useState } from 'react';
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
import { FileText, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTimesheets } from '@/hooks/useTimesheets';
import { Button } from '@/components/ui/button';
import WeeklyProjectsDialog from '@/components/timesheet/WeeklyProjectsDialog';

// Helper function to format date
const formatDate = (date: string): string => {
  if (!date) return 'Date non définie';
  
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
  console.log('EmployeeTimesheets rendering for employeeId:', employeeId);
  const [selectedTimesheetId, setSelectedTimesheetId] = useState<string | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  
  // Use the useTimesheets hook for data fetching
  const { timesheets, isLoading, error, refreshData } = useTimesheets(employeeId);
  
  console.log('Timesheets data in EmployeeTimesheets component:', { 
    isLoading, 
    hasError: !!error, 
    count: timesheets?.length 
  });

  const handleManageWeeklyProjects = (timesheetId: string) => {
    setSelectedTimesheetId(timesheetId);
    setIsProjectDialogOpen(true);
  };

  const handleProjectsDialogClose = () => {
    setIsProjectDialogOpen(false);
    setSelectedTimesheetId(null);
    refreshData();
  };

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

  // Filter out incomplete timesheet objects
  const validTimesheets = timesheets?.filter(timesheet => 
    timesheet && timesheet.id && (timesheet.status || timesheet.weekStartDate || timesheet.employeeId)
  );

  if (!validTimesheets || validTimesheets.length === 0) {
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
            <TableHead>Statut</TableHead>
            <TableHead>Soumis le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validTimesheets.map((timesheet) => (
            <TableRow key={timesheet.id}>
              <TableCell>
                {timesheet.weekStartDate && timesheet.weekEndDate 
                  ? `${formatDate(timesheet.weekStartDate)} - ${formatDate(timesheet.weekEndDate)}` 
                  : timesheet.date ? formatDate(timesheet.date) : 'Non défini'}
              </TableCell>
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
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2"
                  onClick={() => handleManageWeeklyProjects(timesheet.id || '')}
                >
                  <PlusCircle className="h-3 w-3" />
                  Projets
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <WeeklyProjectsDialog 
        open={isProjectDialogOpen} 
        onOpenChange={setIsProjectDialogOpen} 
        timesheetId={selectedTimesheetId || ''}
        onSuccess={refreshData}
      />
    </div>
  );
};

export default EmployeeTimesheets;
