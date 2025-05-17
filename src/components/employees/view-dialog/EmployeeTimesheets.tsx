
import React, { memo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useTimesheets } from '@/hooks/useTimesheets';
import { Timesheet } from '@/lib/constants';
import { toast } from '@/components/ui/use-toast';
import TimesheetTable from './timesheet/TimesheetTable';
import TimesheetDetailDialog from './timesheet/TimesheetDetailDialog';
import { LoadingState, ErrorState, EmptyState } from './timesheet/TimesheetStates';

interface EmployeeTimesheetsProps {
  employeeId: string;
}

const EmployeeTimesheets = memo(({ employeeId }: EmployeeTimesheetsProps) => {
  console.log('EmployeeTimesheets component rendering for employeeId:', employeeId);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
    return <LoadingState title="Feuilles de temps" />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRefresh} title="Feuilles de temps" />;
  }

  if (!timesheets || timesheets.length === 0) {
    return <EmptyState onRefresh={handleRefresh} title="Feuilles de temps" />;
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
      
      <TimesheetTable 
        timesheets={timesheets} 
        onViewTimesheet={handleOpenTimesheet} 
      />

      <TimesheetDetailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        timesheet={selectedTimesheet}
        onClose={handleCloseDialog}
      />
    </div>
  );
});

EmployeeTimesheets.displayName = 'EmployeeTimesheets';

export default EmployeeTimesheets;
