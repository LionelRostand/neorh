import { useState, useEffect } from 'react';
import { format, addDays, parseISO, differenceInCalendarDays } from 'date-fns';
import { toast } from "@/components/ui/use-toast";
import { useFirestore } from '@/hooks/firestore';
import { Timesheet } from "@/lib/constants";
import { getWeekNumber } from '../weekly-timesheet/utils/dateUtils';
import { Project, WeeklyData } from "../types";
import { HR } from "@/lib/constants/collections";

export const useWeeklyProjectsDialog = (open: boolean, timesheetId: string, onSuccess?: () => void) => {
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const timesheetCollection = useFirestore<Timesheet>('hr_timesheet');
  const projectsCollection = useFirestore('hr_projets');

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

  // Load projects from Firestore
  const loadProjects = async () => {
    try {
      console.log("Loading projects from Firestore...");
      const result = await projectsCollection.getAll();
      
      console.log("Raw projects result:", result);
      
      if (result.docs && result.docs.length > 0) {
        // Transform the projects to match our Project interface
        const projectsData = result.docs
          .filter(project => {
            console.log("Project status:", project.status);
            return project.status === 'active';
          })
          .map(project => ({
            id: project.id || '',
            name: project.name || 'Projet sans nom'
          }));
        
        console.log("Filtered active projects:", projectsData);
        setProjects(projectsData);
        
        if (projectsData.length === 0) {
          console.warn("No active projects found");
          toast({
            title: "Information",
            description: "Aucun projet actif trouvé. Veuillez créer des projets dans le menu Projets.",
            variant: "default"
          });
        }
      } else {
        console.log("No projects found in database");
        setProjects([]);
        toast({
          title: "Information",
          description: "Aucun projet trouvé. Veuillez créer des projets dans le menu Projets.",
          variant: "default"
        });
      }
    } catch (err) {
      console.error("Error loading projects:", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets depuis la base de données",
        variant: "destructive"
      });
      setProjects([]);
    }
  };

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
      console.log("Fetching timesheet with ID:", timesheetId);
      
      // Load projects first
      await loadProjects();
      
      // Then load timesheet data
      const result = await timesheetCollection.getById(timesheetId);
      
      if (!result.docs || result.docs.length === 0) {
        throw new Error("Feuille de temps non trouvée");
      }
      
      const timesheetData = result.docs[0];
      console.log("Timesheet data received:", timesheetData);
      setTimesheet(timesheetData);
      
      // Generate weekly data based on the timesheet period
      if (timesheetData.weekStartDate && timesheetData.weekEndDate) {
        const start = parseISO(timesheetData.weekStartDate);
        const end = parseISO(timesheetData.weekEndDate);
        const daysInPeriod = differenceInCalendarDays(end, start) + 1;
        const numberOfWeeks = Math.ceil(daysInPeriod / 7);
        
        console.log(`Period spans ${daysInPeriod} days and ${numberOfWeeks} weeks`);
        
        const weeks: WeeklyData[] = [];
        for (let i = 0; i < numberOfWeeks; i++) {
          const weekStartDate = addDays(start, i * 7);
          const weekEndDate = i === numberOfWeeks - 1 ? end : addDays(weekStartDate, 6);
          
          weeks.push({
            week: getWeekNumber(weekStartDate),
            startDate: format(weekStartDate, 'yyyy-MM-dd'),
            endDate: format(weekEndDate, 'yyyy-MM-dd'),
            projects: timesheetData.weeklyProjects && timesheetData.weeklyProjects[i] 
              ? timesheetData.weeklyProjects[i].projects 
              : []
          });
        }
        
        setWeeklyData(weeks);
        if (weeks.length > 0) {
          setActiveTab(weeks[0].week.toString());
        }
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

  // Check if week can be submitted
  const isSubmittable = weeklyData.some(week => {
    const totalDays = week.projects.reduce((sum, project) => sum + project.days, 0);
    return totalDays > 0 && totalDays <= 5;
  });

  const handleAddProject = (weekIndex: number) => {
    if (!selectedProject) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner un projet",
        variant: "default"
      });
      return;
    }
    
    setWeeklyData(prev => {
      const updated = [...prev];
      const existingProjectIndex = updated[weekIndex].projects.findIndex(
        p => p.projectId === selectedProject
      );
      
      if (existingProjectIndex >= 0) {
        toast({
          title: "Information",
          description: "Ce projet est déjà ajouté à cette semaine",
          variant: "default"
        });
        return prev;
      }
      
      updated[weekIndex].projects.push({
        projectId: selectedProject,
        days: 0
      });
      return updated;
    });
    
    setSelectedProject('');
  };
  
  const handleUpdateDays = (weekIndex: number, projectIndex: number, days: number) => {
    const validDays = Math.max(0, Math.min(5, days));
    
    setWeeklyData(prev => {
      const updated = [...prev];
      updated[weekIndex].projects[projectIndex].days = validDays;
      
      const totalDays = updated[weekIndex].projects.reduce((sum, project) => sum + project.days, 0);
      
      if (totalDays > 5) {
        toast({
          title: "Attention",
          description: "Le total des jours ne peut pas dépasser 5 jours par semaine",
          variant: "destructive"
        });
      }
      
      return updated;
    });
  };
  
  const handleRemoveProject = (weekIndex: number, projectIndex: number) => {
    setWeeklyData(prev => {
      const updated = [...prev];
      updated[weekIndex].projects.splice(projectIndex, 1);
      return updated;
    });
  };
  
  const handleSubmitWeek = async (weekIndex: number) => {
    if (!timesheet || !timesheet.id) return;
    
    const week = weeklyData[weekIndex];
    const totalDays = week.projects.reduce((sum, project) => sum + project.days, 0);
    
    if (totalDays === 0) {
      toast({
        title: "Attention",
        description: "Ajoutez au moins un projet avec des jours pour soumettre",
        variant: "destructive"
      });
      return;
    }
    
    if (totalDays > 5) {
      toast({
        title: "Attention",
        description: "Le total des jours ne peut pas dépasser 5 jours par semaine",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      const weeklyProjects = weeklyData.map(w => ({
        week: w.week,
        startDate: w.startDate,
        endDate: w.endDate,
        projects: w.projects
      }));
      
      await timesheetCollection.update(timesheet.id, {
        ...timesheet,
        weeklyProjects,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      });
      
      toast({
        title: "Succès",
        description: `Semaine ${week.week} soumise avec succès`,
        variant: "default"
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting week:", error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre la semaine",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleSave = async () => {
    if (!timesheet || !timesheet.id) return;
    
    try {
      setSaving(true);
      const weeklyProjects = weeklyData.map(week => ({
        week: week.week,
        startDate: week.startDate,
        endDate: week.endDate,
        projects: week.projects
      }));
      
      await timesheetCollection.update(timesheet.id, {
        ...timesheet,
        weeklyProjects
      });
      
      toast({
        title: "Succès",
        description: "Les données ont été enregistrées avec succès",
        variant: "default"
      });
    } catch (error) {
      console.error("Error saving timesheet:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les données",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
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
