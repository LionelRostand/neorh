
import React, { useState } from 'react';
import TimesheetsHeader from "@/components/timesheet/TimesheetsHeader";
import TimesheetsContent from "@/components/timesheet/TimesheetsContent";
import NewTimesheetForm from "@/components/timesheet/NewTimesheetForm";
import { useTimesheetData } from "@/hooks/useTimesheetData";
import { toast } from "@/components/ui/use-toast";
import { useFirestore } from "@/hooks/firestore";
import { Timesheet } from "@/lib/constants";

const FeuillesDeTemps = () => {
  const [isNewTimesheetOpen, setIsNewTimesheetOpen] = useState(false);
  const { timesheets, loading, countByStatus, refreshTimesheets } = useTimesheetData();
  const timesheetCollection = useFirestore<Timesheet>('hr_timesheet');

  console.log('FeuillesDeTemps page rendering with:', {timesheets, loading, countByStatus});

  const handleOpenNewTimesheet = () => {
    setIsNewTimesheetOpen(true);
  };

  const handleCloseNewTimesheet = () => {
    setIsNewTimesheetOpen(false);
  };

  const handleTimesheetCreated = () => {
    // Refresh the timesheet list
    refreshTimesheets();
  };

  const handleApproveTimesheet = async (id: string) => {
    try {
      const timesheet = await timesheetCollection.getById(id);
      if (!timesheet) {
        toast({
          title: "Erreur",
          description: "Feuille de temps non trouvée",
          variant: "destructive"
        });
        return;
      }

      await timesheetCollection.update(id, {
        ...timesheet,
        status: "approved",
        approvedAt: new Date().toISOString(),
        approvedBy: "Manager" // Dans une vraie application, ce serait l'ID du manager connecté
      });

      toast({
        title: "Succès",
        description: "Feuille de temps approuvée avec succès",
        variant: "default"
      });

      refreshTimesheets();
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la feuille de temps",
        variant: "destructive"
      });
    }
  };

  const handleRejectTimesheet = async (id: string) => {
    try {
      const timesheet = await timesheetCollection.getById(id);
      if (!timesheet) {
        toast({
          title: "Erreur",
          description: "Feuille de temps non trouvée",
          variant: "destructive"
        });
        return;
      }

      await timesheetCollection.update(id, {
        ...timesheet,
        status: "rejected",
        approvedAt: new Date().toISOString(), // On garde la date de décision
        approvedBy: "Manager" // Dans une vraie application, ce serait l'ID du manager connecté
      });

      toast({
        title: "Succès",
        description: "Feuille de temps rejetée",
        variant: "default"
      });

      refreshTimesheets();
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la feuille de temps",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 md:p-6">
      <TimesheetsHeader onNewTimesheet={handleOpenNewTimesheet} />
      
      <TimesheetsContent
        timesheets={timesheets}
        loading={loading}
        countByStatus={countByStatus}
        onRefresh={refreshTimesheets}
        onApprove={handleApproveTimesheet}
        onReject={handleRejectTimesheet}
      />

      <NewTimesheetForm 
        open={isNewTimesheetOpen} 
        onClose={handleCloseNewTimesheet} 
        onSuccess={handleTimesheetCreated} 
      />
    </div>
  );
};

export default FeuillesDeTemps;
