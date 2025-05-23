
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Timesheet } from "@/lib/constants";
import { Project, WeeklyData } from "../types";
import { useTimesheetService } from './services/timesheetService';
import { useProjectService } from './services/projectService';
import { useWeeklyDataManager } from './hooks/useWeeklyDataManager';
import { useFormOperations } from './hooks/useFormOperations';

export const useWeeklyProjectsDialog = (
  open: boolean,
  timesheetId: string,
  onSuccess?: () => void
) => {
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { fetchTimesheetById } = useTimesheetService();
  const { loadProjects } = useProjectService();
  
  const {
    weeklyData,
    setWeeklyData,
    generateWeeklyData,
    addProject,
    updateDays,
    removeProject,
    isSubmittable
  } = useWeeklyDataManager();

  const {
    saving,
    submitting,
    handleSave,
    handleSubmitWeek
  } = useFormOperations(timesheet, weeklyData, onSuccess);

  // Progress animation effect
  useEffect(() => {
    if (loading && !error) {
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
  }, [loading, error]);

  // Load data when dialog opens
  useEffect(() => {
    if (open && timesheetId) {
      loadData();
    }
  }, [open, timesheetId]);

  const loadData = async () => {
    if (!timesheetId) {
      setError(new Error("ID de feuille de temps non fourni"));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLoadingProgress(10);

      console.log("Loading timesheet and projects data...");

      // Load projects and timesheet in parallel
      const [projectsData, timesheetData] = await Promise.all([
        loadProjects(),
        fetchTimesheetById(timesheetId)
      ]);

      setLoadingProgress(70);

      console.log("Projects loaded:", projectsData);
      console.log("Timesheet loaded:", timesheetData);

      setProjects(projectsData);
      setTimesheet(timesheetData);

      if (timesheetData) {
        const weeklyDataGenerated = generateWeeklyData(timesheetData);
        setWeeklyData(weeklyDataGenerated);
        
        if (weeklyDataGenerated.length > 0) {
          setActiveTab(weeklyDataGenerated[0].week.toString());
        }
      }

      setLoadingProgress(100);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err : new Error("Erreur lors du chargement des données"));
    } finally {
      setLoading(false);
    }
  };

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
    loadData();
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
