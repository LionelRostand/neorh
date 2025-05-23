
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { Document } from "@/lib/constants";

/**
 * Formats the upload date of a document safely
 */
export const formatUploadDate = (uploadDate: string | Date | undefined): string => {
  try {
    if (!uploadDate) return "Date inconnue";
    
    // Check if date is already a Date object
    const dateToFormat = typeof uploadDate === 'string' 
      ? new Date(uploadDate)
      : uploadDate;
    
    // Check if date is valid
    if (!isValid(dateToFormat)) {
      console.warn("Invalid date:", uploadDate);
      return "Date invalide";
    }
    
    return format(dateToFormat, 'dd MMMM yyyy', { locale: fr });
  } catch (error) {
    console.error("Date formatting error:", error, uploadDate);
    return "Date non disponible";
  }
};

/**
 * Determines the appropriate status color for a document
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'pending':
    case 'pending_signature': return 'bg-amber-100 text-amber-800';
    case 'expired': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Returns the status label for display
 */
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'active': return 'Actif';
    case 'pending': return 'En attente';
    case 'pending_signature': return 'En attente de signatures';
    case 'expired': return 'Expiré';
    case 'draft': return 'Brouillon';
    default: return 'Non défini';
  }
};

/**
 * Gets the category label for display
 */
export const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'contracts': return 'Contrat';
    case 'paystubs': return 'Bulletin de paie';
    case 'certificates': return 'Certificat';
    default: return 'Document';
  }
};

/**
 * Checks if a document needs signature
 */
export const needsSignature = (document: Document): boolean => {
  return document.category === 'contracts' && 
         (document.status === 'pending_signature' || document.status === 'pending');
};
