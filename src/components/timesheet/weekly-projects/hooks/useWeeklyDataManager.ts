
import { useState } from 'react';
import { format, addDays, parseISO, differenceInCalendarDays } from 'date-fns';
import { toast } from "@/components/ui/use-toast";
import { Timesheet } from "@/lib/constants";
import { getWeekNumber } from '../../weekly-timesheet/utils/dateUtils';
import { WeeklyData } from "../types";

export const useWeeklyDataManager = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);

  const generateWeeklyData = (timesheet: Timesheet): WeeklyData[] => {
    if (!timesheet.weekStartDate || !timesheet.weekEndDate) {
      return [];
    }

    const start = parseISO(timesheet.weekStartDate);
    const end = parseISO(timesheet.weekEndDate);
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
        projects: timesheet.weeklyProjects && timesheet.weeklyProjects[i] 
          ? timesheet.weeklyProjects[i].projects 
          : []
      });
    }
    
    return weeks;
  };

  const addProject = (weekIndex: number, selectedProject: string) => {
    if (!selectedProject) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner un projet",
        variant: "default"
      });
      return false;
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
    
    return true;
  };

  const updateDays = (weekIndex: number, projectIndex: number, days: number) => {
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

  const removeProject = (weekIndex: number, projectIndex: number) => {
    setWeeklyData(prev => {
      const updated = [...prev];
      updated[weekIndex].projects.splice(projectIndex, 1);
      return updated;
    });
  };

  const isSubmittable = weeklyData.some(week => {
    const totalDays = week.projects.reduce((sum, project) => sum + project.days, 0);
    return totalDays > 0 && totalDays <= 5;
  });

  return {
    weeklyData,
    setWeeklyData,
    generateWeeklyData,
    addProject,
    updateDays,
    removeProject,
    isSubmittable
  };
};
