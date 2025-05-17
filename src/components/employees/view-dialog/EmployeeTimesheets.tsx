
import React, { memo, useState, useCallback } from 'react';
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
import { FileText, Calendar, Clock, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTimesheets } from '@/hooks/useTimesheets';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TimesheetDetailForm from '@/components/timesheet/TimesheetDetailForm';
import { Timesheet } from '@/lib/constants';
import { toast } from '@/components/ui/use-toast';

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

const EmployeeTimesheets = memo(({ employeeId }: EmployeeTimesheetsProps) => {
  console.log('EmployeeTimesheets component rendering for employeeId:', employeeId);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Use the useTimesheets hook for data fetching
  const { timesheets, isLoading, error, refreshTimesheets } = useTimesheets(employeeId);
  
  console.log('Timesheets data:', { isLoading, error, count: timesheets?.length });

  // Fonction pour forcer un rafraîchissement des données
  const handleRefresh = useCallback(async () => {
    toast({
      title: "Rafraîchissement en cours",
      description: "Chargement des feuilles de temps...",
    });
    try {
      await refreshTimesheets();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Erreur lors du rafraîchissement:", err);
      toast({
        title: "Erreur de rafraîchissement",
        description: "Impossible de rafraîchir les données. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [refreshTimesheets]);

  const handleOpenTimesheet = useCallback((timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    // Rafraîchir les données après fermeture du dialogue
    refreshTimesheets();
  }, [refreshTimesheets]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Feuilles de temps</h3>
        </div>
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Feuilles de temps</h3>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Réessayer
          </Button>
        </div>
        <div className="p-4 text-red-500 border border-red-300 rounded-md">
          Erreur: {error.message}
        </div>
      </div>
    );
  }

  if (!timesheets || timesheets.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Feuilles de temps</h3>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Rafraîchir
          </Button>
        </div>
        <div className="space-y-6 text-center py-10">
          <div className="flex justify-center">
            <FileText className="h-16 w-16 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold">Aucune feuille de temps</h3>
          <p className="text-gray-500">
            Aucune feuille de temps n'est disponible pour cet employé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Feuilles de temps</h3>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Rafraîchir
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Période</TableHead>
            <TableHead>Projet</TableHead>
            <TableHead>Heures</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Soumis le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheets.map((timesheet) => (
            <TableRow key={timesheet.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleOpenTimesheet(timesheet)}>
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
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  handleOpenTimesheet(timesheet);
                }}>
                  <Calendar className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Détails de la feuille de temps
            </DialogTitle>
            <DialogDescription>
              Période: {selectedTimesheet?.weekStartDate && selectedTimesheet?.weekEndDate 
                ? `${formatDate(selectedTimesheet.weekStartDate)} - ${formatDate(selectedTimesheet.weekEndDate)}` 
                : 'Non définie'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTimesheet && (
            <TimesheetDetailForm 
              timesheet={selectedTimesheet}
              onClose={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

EmployeeTimesheets.displayName = 'EmployeeTimesheets';

export default EmployeeTimesheets;
