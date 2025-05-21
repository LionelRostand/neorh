
import { useState, useEffect } from 'react';
import { format, addDays, parseISO, differenceInCalendarDays } from 'date-fns';
import { toast } from "@/components/ui/use-toast";
import { useFirestore } from '@/hooks/firestore';
import { Timesheet } from "@/lib/constants";
import { getWeekNumber } from '../utils/dateUtils';
import { Project, WeeklyData } from "../../types";

// Mock projects data
const mockProjects: Project[] = [
  { id: 'PROJ-001', name: 'Développement Frontend' },
  { id: 'PROJ-002', name: 'Base de données' },
  { id: 'PROJ-003', name: 'Migration ERP' },
  { id: 'PROJ-004', name: 'Support Technique' },
  { id: 'PROJ-005', name: 'Formation' },
];

export const useWeeklyTimesheetPage = (timesheetId: string) => {
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [projects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const timesheetCollection = useFirestore<Timesheet>('hr_timesheet');
  // Flag to track if initial fetch has been attempted
  const [fetchAttempted, setFetchAttempted] = useState(false);
  // Progress animation for loading state
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Progress animation effect
  useEffect(() => {
    if (loading && !error) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          // Only incrementally increase to 90% max to show it's still loading
          if (prev < 90) {
            return prev + 10;
          }
          return prev;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100); // Complete the progress when loaded or error
    }
  }, [loading, error]);

  // Fetch the timesheet data
  const fetchTimesheet = async () => {
    if (!timesheetId) {
      setError(new Error("ID de feuille de temps non fourni"));
      setLoading(false);
      setFetchAttempted(true);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching timesheet with ID:", timesheetId);
      const result = await timesheetCollection.getById(timesheetId);
      
      // Mark fetch as attempted regardless of result
      setFetchAttempted(true);
      
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
      setRetrying(false);
    }
  };

  // Initial fetch on mount - only run once
  useEffect(() => {
    if (!fetchAttempted && timesheetId) {
      fetchTimesheet();
    }
  }, [timesheetId, fetchAttempted]);

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
    setRetrying(true);
    setFetchAttempted(false); // Reset fetch attempt flag to allow a new fetch
    fetchTimesheet();
  };

  return {
    timesheet,
    loading,
    error,
    saving,
    retrying,
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
    handleRetry,
    fetchAttempted
  };
};
