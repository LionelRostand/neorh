
import { format, addDays } from 'date-fns';
import { Timesheet } from "@/lib/constants";
import { WeeklyData } from "../../types";

// Get the week number for a given date
export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  return `${startDate} - ${endDate}`;
};
