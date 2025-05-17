
import { Employee } from '@/types/employee';
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { setupDocument } from '../documentSetup';

export const generateFeuillesDeTempsTab = (doc: JsPDF, employee: Employee) => {
  // Configuration du document
  setupDocument(doc, 'Feuilles de temps');
  
  // Titre
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text('Feuilles de temps', 15, 30);
  
  // Information sur l'employé
  doc.setFontSize(12);
  doc.setTextColor(108, 117, 125);
  doc.text(`Employé: ${employee.name}`, 15, 40);
  
  // Message pas de feuilles de temps
  doc.setFontSize(14);
  doc.setTextColor(108, 117, 125);
  doc.text('Aucune feuille de temps n\'est disponible pour cet employé.', 15, 60);
  
  // Dans une version plus complète, on pourrait récupérer les vraies données
  // et les afficher dans un tableau avec autoTable
  // Exemple:
  /*
  const headers = [['Période', 'Projet', 'Heures', 'Statut', 'Soumis le']];
  
  const data = timesheets.map(ts => [
    `${formatDate(ts.startDate)} - ${formatDate(ts.endDate)}`,
    ts.project || 'Non assigné',
    `${ts.hours}h`,
    ts.status,
    ts.submittedAt ? formatDate(ts.submittedAt) : 'Non soumis'
  ]);
  
  autoTable(doc, {
    startY: 65,
    head: headers,
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202], textColor: 255 }
  });
  */
  
  // Pour le moment, seulement un espace vide avec un message
  autoTable(doc, {
    startY: 65,
    head: [['Période', 'Projet', 'Heures', 'Statut', 'Soumis le']],
    body: [],
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202], textColor: 255 }
  });
};
