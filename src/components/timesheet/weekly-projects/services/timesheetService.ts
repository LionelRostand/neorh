import { toast } from "@/components/ui/use-toast";
import { useFirestore } from '@/hooks/firestore';
import { Timesheet } from "@/lib/constants";
import { WeeklyData } from "../../types";

export const useTimesheetService = () => {
  const timesheetCollection = useFirestore<Timesheet>('hr_timesheet');

  const fetchTimesheetById = async (timesheetId: string): Promise<Timesheet | null> => {
    if (!timesheetId) {
      throw new Error("ID de feuille de temps non fourni");
    }
    
    try {
      console.log("Fetching timesheet with ID:", timesheetId);
      const result = await timesheetCollection.getById(timesheetId);
      
      if (!result.docs || result.docs.length === 0) {
        throw new Error("Feuille de temps non trouvée");
      }
      
      const timesheetData = result.docs[0];
      console.log("Timesheet data received:", timesheetData);
      return timesheetData;
    } catch (err) {
      console.error("Error fetching timesheet:", err);
      throw err instanceof Error ? err : new Error("Erreur lors du chargement des données");
    }
  };

  const updateTimesheet = async (timesheetId: string, data: Partial<Timesheet>): Promise<void> => {
    try {
      await timesheetCollection.update(timesheetId, data);
    } catch (error) {
      console.error("Error updating timesheet:", error);
      throw new Error("Impossible de mettre à jour la feuille de temps");
    }
  };

  const saveWeeklyData = async (timesheet: Timesheet, weeklyData: WeeklyData[]): Promise<void> => {
    if (!timesheet.id) throw new Error("ID de feuille de temps manquant");
    
    const weeklyProjects = weeklyData.map(week => ({
      week: week.week,
      startDate: week.startDate,
      endDate: week.endDate,
      projects: week.projects
    }));

    await updateTimesheet(timesheet.id, {
      ...timesheet,
      weeklyProjects
    });
  };

  const submitWeek = async (timesheet: Timesheet, weeklyData: WeeklyData[]): Promise<void> => {
    if (!timesheet.id) throw new Error("ID de feuille de temps manquant");
    
    const weeklyProjects = weeklyData.map(w => ({
      week: w.week,
      startDate: w.startDate,
      endDate: w.endDate,
      projects: w.projects
    }));
    
    await updateTimesheet(timesheet.id, {
      ...timesheet,
      weeklyProjects,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    });
  };

  return {
    fetchTimesheetById,
    updateTimesheet,
    saveWeeklyData,
    submitWeek
  };
};
