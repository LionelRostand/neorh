
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Timesheet } from "@/lib/constants";
import { Project } from "../types";
import { useProjectService } from './services/projectService';
import { useTimesheetService } from './services/timesheetService';
import { useWeeklyDataManager } from './hooks/useWeeklyDataManager';
import { useFormOperations } from './hooks/useFormOperations';

export const useWeeklyProjectsDialog = (open: boolean, timesheetId: string, onSuccess?: () => void) => {
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const { loadProjects } = useProjectService();
  const { fetchTimesheetById } = useTimesheetService();
  const {
    weeklyData,
    setWeeklyData,
    generateWeeklyData,
    addProject,
    updateDays,
    removeProject,
    isSubmittable
  } = useWeeklyDataManager();

  const { saving, submitting, handleSave, handleSubmitWeek } = useFormOperations(
    timesheet,
    weeklyData,
    onSuccess
  );

  // Progress animation effect
  useEffect(() => {
    if (loading && !error && open) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev < 90) {
            return prev + 10;
          }
          return prev;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [loading, error, open]);

  // Fetch the timesheet data
  const fetchTimesheet = async () => {
    if (!timesheetId) {
      setError(new Error("ID de feuille de temps non fourni"));
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Load projects first
      const projectsData = await loadProjects();
      setProjects(projectsData);
      
      // Then load timesheet data
      const timesheetData = await fetchTimesheetById(timesheetId);
      setTimesheet(timesheetData);
      
      // Generate weekly data based on the timesheet period
      const weeks = generateWeeklyData(timesheetData);
      setWeeklyData(weeks);
      
      if (weeks.length > 0) {
        setActiveTab(weeks[0].week.toString());
      }
    } catch (err) {
      console.error("Error fetching timesheet:", err);
      setError(err instanceof Error ? err : new Error("Erreur lors du chargement des données"));
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de la feuille de temps",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data when dialog opens
  useEffect(() => {
    if (open && timesheetId) {
      fetchTimesheet();
    }
  }, [open, timesheetId]);

  const handleAddProject = (weekIndex: number) => {
    const success = addProject(weekIndex, selectedProject);
    if (success) {
      setSelectedProject('');
    }
  };
  
  const handleUpdateDays = (weekIndex: number, projectIndex: number, days: number) => {
    updateDays(weekIndex, projectIndex, days);
  };
  
  const handleRemoveProject = (weekIndex: number, projectIndex: number) => {
    removeProject(weekIndex, projectIndex);
  };

  const handleRetry = () => {
    fetchTimesheet();
  };

  return {
    timesheet,
    loading,
    error,
    saving,
    submitting,
    projects,
    selectedProject,
    setSelectedProject,
    weeklyData,
    activeTab,
    setActiveTab,
    loadingProgress,
    isSubmittable,
    handleAddProject,
    handleUpdateDays,
    handleRemoveProject,
    handleSubmitWeek,
    handleSave,
    handleRetry
  };
};
