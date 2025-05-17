
import jsPDF from 'jspdf';
import { Employee } from '@/types/employee';

/**
 * Génère la section compétences
 */
export const generateCompetencesTab = (doc: jsPDF, employee: Employee) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Compétences', 14, 30);

  // Message si aucune compétence n'est trouvée
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucune compétence enregistrée pour cet employé.', 14, 45);
  
  // Pour une version future, on pourrait ajouter un tableau des compétences
  // ou des graphiques représentant les niveaux de compétences
};
