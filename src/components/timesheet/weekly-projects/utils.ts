
import { format, addDays, parseISO, differenceInCalendarDays } from 'date-fns';
import { Timesheet } from "@/lib/constants";
import { WeeklyData } from "../types";

// Mock projects data
export const mockProjects = [
  { id: 'PROJ-001', name: 'Développement Frontend' },
  { id: 'PROJ-002', name: 'Base de données' },
  { id: 'PROJ-003', name: 'Migration ERP' },
  { id: 'PROJ-004', name: 'Support Technique' },
  { id: 'PROJ-005', name: 'Formation' },
];

// Get the week number for a given date
export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Generate weekly data from timesheet
export const generateWeeklyData = (timesheet: Timesheet): WeeklyData[] => {
  if (!timesheet.weekStartDate || !timesheet.weekEndDate) {
    // Create default week data if dates are missing
    const start = new Date();
    return [{
      week: getWeekNumber(start),
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(addDays(start, 6), 'yyyy-MM-dd'),
      projects: []
    }];
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
