
import { Period } from "../types";

/**
 * Generates monthly periods for payslip selection
 * @returns An array of periods for current and next year
 */
export const generateMonthlyPeriods = (): Period[] => {
  const periods: Period[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  // Generate periods for current and next year
  for (let year = currentYear; year <= currentYear + 1; year++) {
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'long' });
      const periodId = `${year}-${month + 1}`;
      const periodLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
      periods.push({ id: periodId, label: periodLabel });
    }
  }
  return periods;
};
