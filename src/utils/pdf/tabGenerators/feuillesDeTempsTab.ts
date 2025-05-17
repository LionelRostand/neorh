
import { Employee } from '@/types/employee';
import { Timesheet, DailyEntry } from '@/lib/constants';
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { setupDocument } from '../documentSetup';
import { format } from 'date-fns';

// Helper function to format dates
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Non défini';
  try {
    return format(new Date(dateStr), 'dd/MM/yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Date invalide';
  }
};

export const generateFeuillesDeTempsTab = (doc: JsPDF, employee: Employee, timesheets?: Timesheet[]) => {
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
  
  const headers = [['Période', 'Projet', 'Heures', 'Statut', 'Soumis le']];
  
  if (!timesheets || timesheets.length === 0) {
    // Message pas de feuilles de temps
    doc.setFontSize(14);
    doc.setTextColor(108, 117, 125);
    doc.text('Aucune feuille de temps n\'est disponible pour cet employé.', 15, 60);
    
    // Table vide avec en-têtes
    autoTable(doc, {
      startY: 65,
      head: headers,
      body: [],
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202], textColor: 255 }
    });
  } else {
    // Générer les données de la table
    const data = timesheets.map(ts => [
      `${formatDate(ts.weekStartDate)} - ${formatDate(ts.weekEndDate)}`,
      ts.projectId || 'Non assigné',
      `${ts.hours || 0}h`,
      ts.status === 'approved' ? 'Approuvé' : 
        ts.status === 'submitted' ? 'En attente' : 
        ts.status === 'rejected' ? 'Rejeté' : 'Brouillon',
      ts.submittedAt ? formatDate(ts.submittedAt) : 'Non soumis'
    ]);
    
    // Générer la table avec autoTable
    autoTable(doc, {
      startY: 55,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202], textColor: 255 }
    });
    
    // Pour chaque feuille de temps, ajouter le détail des entrées quotidiennes si elles existent
    let yPosition = doc.lastAutoTable?.finalY || 150;
    
    timesheets.forEach((ts, index) => {
      if (ts.dailyEntries && ts.dailyEntries.length > 0) {
        yPosition += 20;
        
        // Titre pour les détails de cette feuille de temps
        doc.setFontSize(14);
        doc.setTextColor(44, 62, 80);
        doc.text(`Détails de la période: ${formatDate(ts.weekStartDate)} - ${formatDate(ts.weekEndDate)}`, 15, yPosition);
        
        // En-têtes et données des entrées quotidiennes
        const dailyHeaders = [['Date', 'Projet', 'Heures', 'Notes']];
        const dailyData = ts.dailyEntries.map(entry => [
          formatDate(entry.date),
          entry.projectId || 'Non assigné',
          `${entry.hours}`,
          entry.notes || ''
        ]);
        
        // Générer la table des entrées quotidiennes
        autoTable(doc, {
          startY: yPosition + 5,
          head: dailyHeaders,
          body: dailyData,
          theme: 'grid',
          headStyles: { fillColor: [100, 160, 220], textColor: 255 }
        });
        
        yPosition = doc.lastAutoTable?.finalY || yPosition + 60;
        
        // Si on a besoin d'une nouvelle page
        if (yPosition > 250 && index < timesheets.length - 1) {
          doc.addPage();
          yPosition = 20;
        }
      }
    });
  }
};
