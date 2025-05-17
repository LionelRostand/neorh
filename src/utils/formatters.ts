
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Format date as DD/MM/YYYY
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};
