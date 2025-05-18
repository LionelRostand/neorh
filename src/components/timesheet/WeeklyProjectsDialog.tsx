
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { WeeklyProjectsDialogProps } from "./types";
import LoadingState from "./weekly-projects/LoadingState";
import ErrorState from "./weekly-projects/ErrorState";
import WeeklyContent from "./weekly-projects/WeeklyContent";
import { useWeeklyProjectsDialog } from "./weekly-projects/useWeeklyProjectsDialog";

const WeeklyProjectsDialog = ({ open, onOpenChange, timesheetId, onSuccess }: WeeklyProjectsDialogProps) => {
  const {
    timesheet,
    loading,
    error,
    saving,
    projects,
    selectedProject,
    setSelectedProject,
    weeklyData,
    activeTab,
    setActiveTab,
    loadingProgress,
    handleAddProject,
    handleUpdateDays,
    handleRemoveProject,
    handleSave,
    handleRetry
  } = useWeeklyProjectsDialog(open, timesheetId, onSuccess);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestion des projets hebdomadaires</DialogTitle>
        </DialogHeader>
        
        {loading && <LoadingState loadingProgress={loadingProgress} />}
        
        {error && <ErrorState error={error} onRetry={handleRetry} />}
        
        {!loading && !error && timesheet && (
          <WeeklyContent
            timesheet={timesheet}
            weeklyData={weeklyData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            handleAddProject={handleAddProject}
            handleUpdateDays={handleUpdateDays}
            handleRemoveProject={handleRemoveProject}
          />
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button 
            onClick={handleSave} 
            className="bg-green-600 hover:bg-green-700"
            disabled={saving || loading || !!error}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklyProjectsDialog;
