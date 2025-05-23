
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, 'd MMMM yyyy', { locale: fr });
  } catch (error) {
    return dateString;
  }
};

export const parseDate = (formattedDate: string): Date => {
  try {
    // Try to parse the date from the French format
    const parts = formattedDate.split(' ');
    const day = parseInt(parts[0], 10);
    const month = getMonthNumber(parts[1]);
    const year = parseInt(parts[2], 10);
    
    return new Date(year, month, day);
  } catch (e) {
    return new Date(); // Fallback to current date
  }
};

export const getMonthNumber = (monthName: string): number => {
  const months = {
    'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3,
    'mai': 4, 'juin': 5, 'juillet': 6, 'août': 7,
    'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
  };
  
  return months[monthName.toLowerCase() as keyof typeof months] || 0;
};
