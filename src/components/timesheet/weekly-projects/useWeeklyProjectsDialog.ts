
import { useState, useEffect, useRef } from 'react';
import { format, addDays } from 'date-fns';
import { toast } from "@/components/ui/use-toast";
import { useFirestore } from '@/hooks/firestore';
import { Timesheet } from "@/lib/constants";
import { WeeklyData } from "../types";
import { mockProjects, getWeekNumber, generateWeeklyData } from "./utils";

export const useWeeklyProjectsDialog = (open: boolean, timesheetId: string, onSuccess?: () => void) => {
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [projects] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isSubmittable, setIsSubmittable] = useState(true);
  const timesheetCollection = useFirestore<Timesheet>('hr_timesheet');
  
  // Flag to track if initial fetch has been attempted
  const hasAttemptedFetch = useRef(false);
  // Track previous timesheet ID to avoid repeated fetches for the same ID
  const prevTimesheetId = useRef<string | null>(null);

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
      }, 300);

      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [loading, error]);

  // Reset states when dialog closes
  useEffect(() => {
    if (!open) {
      setTimesheet(null);
      setWeeklyData([]);
      setSelectedProject('');
      setActiveTab('');
      setError(null);
      setLoadingProgress(0);
      setSubmitting(false);
      // Reset the fetching flag when dialog closes
      hasAttemptedFetch.current = false;
      prevTimesheetId.current = null;
    }
  }, [open]);

  // Fetch the timesheet data
  useEffect(() => {
    // Only fetch if dialog is open and we have a timesheet ID
    if (!open || !timesheetId) {
      return;
    }
    
    // Skip fetch if it's the same timesheet ID and we've already attempted a fetch
    if (hasAttemptedFetch.current && prevTimesheetId.current === timesheetId) {
      console.log("Skipping duplicate fetch for timesheet ID:", timesheetId);
      return;
    }
    
    const fetchTimesheet = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching timesheet with ID:", timesheetId);
        
        // Update the tracking variables
        hasAttemptedFetch.current = true;
        prevTimesheetId.current = timesheetId;
        
        // Create a controller to abort the fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        try {
          const result = await Promise.race([
            timesheetCollection.getById(timesheetId),
            new Promise<null>((_, reject) => 
              setTimeout(() => reject(new Error("Délai d'attente dépassé")), 8000)
            )
          ]) as Timesheet | null;
          
          clearTimeout(timeoutId);
          
          if (!result) {
            console.log("No timesheet found with ID:", timesheetId);
            // Use mock data if no result found
            const mockTimesheet: Timesheet = {
              id: timesheetId,
              employeeId: "1",
              weekStartDate: "2025-05-10",
              weekEndDate: "2025-05-16",
              hours: 40,
              status: "draft",
              weeklyProjects: []
            };
            setTimesheet(mockTimesheet);
            
            const weeks = generateWeeklyData(mockTimesheet);
            setWeeklyData(weeks);
            if (weeks.length > 0) {
              setActiveTab(weeks[0].week.toString());
            }
          } else {
            console.log("Timesheet data received:", result);
            setTimesheet(result);
            
            const weeks = generateWeeklyData(result);
            setWeeklyData(weeks);
            if (weeks.length > 0) {
              setActiveTab(weeks[0].week.toString());
            }
            
            // Check if timesheet is submittable
            setIsSubmittable(result.status === 'draft' || result.status === 'rejected');
          }
        } catch (err) {
          if (controller.signal.aborted) {
            throw new Error("Délai d'attente dépassé lors du chargement des données");
          }
          throw err;
        }
      } catch (err) {
        console.error("Error fetching timesheet:", err);
        setError(err instanceof Error ? err : new Error("Erreur lors du chargement des données"));
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de la feuille de temps",
          variant: "destructive"
        });
        
        // Create empty weekly data to allow user to add projects anyway
        setWeeklyData([{
          week: getWeekNumber(new Date()),
          startDate: format(new Date(), 'yyyy-MM-dd'),
          endDate: format(addDays(new Date(), 6), 'yyyy-MM-dd'),
          projects: []
        }]);
        setActiveTab(getWeekNumber(new Date()).toString());
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheet();
  }, [open, timesheetId, timesheetCollection]);

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
    // Ensure days value is between 0 and 5
    const validDays = Math.max(0, Math.min(5, days));
    
    setWeeklyData(prev => {
      const updated = [...prev];
      updated[weekIndex].projects[projectIndex].days = validDays;
      
      // Calculate total days for this week
      const totalDays = updated[weekIndex].projects.reduce((sum, project) => sum + project.days, 0);
      
      // If total days exceed 5, show warning
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
    
    try {
      setSubmitting(true);
      
      // Validate days sum for this week
      const weekData = weeklyData[weekIndex];
      const totalDays = weekData.projects.reduce((sum, project) => sum + project.days, 0);
      
      if (totalDays === 0) {
        toast({
          title: "Attention",
          description: "Veuillez ajouter au moins un projet avant de soumettre",
          variant: "default"
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
      
      // Format data for saving
      const updatedTimesheet = {
        ...timesheet,
        status: "submitted",
        submittedAt: new Date().toISOString(),
        weeklyProjects: [...weeklyData]
      };
      
      await timesheetCollection.update(timesheet.id, updatedTimesheet);
      
      setTimesheet(updatedTimesheet);
      setIsSubmittable(false);
      
      toast({
        title: "Succès",
        description: "La feuille de temps a été soumise avec succès",
        variant: "default"
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre la feuille de temps",
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
      // Format data for saving
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
      
      if (onSuccess) {
        onSuccess();
      }
      
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
    setError(null);
    setLoading(true);
    hasAttemptedFetch.current = false; // Reset fetch flag to allow retry
    prevTimesheetId.current = null;
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
