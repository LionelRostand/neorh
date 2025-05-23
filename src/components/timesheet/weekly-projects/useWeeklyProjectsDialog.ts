
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
      }, 200);

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

      // Load projects first
      setLoadingProgress(30);
      const projectsData = await loadProjects();
      console.log("Projects loaded for dialog:", projectsData);
      setProjects(projectsData);

      // Load timesheet
      setLoadingProgress(60);
      const timesheetData = await fetchTimesheetById(timesheetId);
      console.log("Timesheet loaded:", timesheetData);
      setTimesheet(timesheetData);

      if (timesheetData) {
        const weeklyDataGenerated = generateWeeklyData(timesheetData);
        setWeeklyData(weeklyDataGenerated);
        
        if (weeklyDataGenerated.length > 0) {
          setActiveTab(weeklyDataGenerated[0].week.toString());
        }
      }

      setLoadingProgress(100);
      
      // Show success message if projects were loaded
      if (projectsData.length > 0) {
        toast({
          title: "Données chargées",
          description: `${projectsData.length} projet(s) disponible(s) pour sélection`,
          variant: "default"
        });
      }
      
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err : new Error("Erreur lors du chargement des données"));
      toast({
        title: "Erreur",
        description: "Impossible de charger les données. Vérifiez votre connexion.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = (weekIndex: number) => {
    if (!selectedProject) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un projet",
        variant: "destructive"
      });
      return;
    }

    const success = addProject(weekIndex, selectedProject);
    if (success) {
      setSelectedProject('');
      toast({
        title: "Projet ajouté",
        description: "Le projet a été ajouté avec succès",
        variant: "default"
      });
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
