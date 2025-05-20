
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Employee } from '@/types/employee';

/**
 * Génère la section informations
 */
export const generateInformationsTab = (doc: jsPDF, employee: Employee) => {
  // Position de départ après l'en-tête
  const startY = 110; // Ajusté pour commencer après la date de génération du document
  
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Informations de l\'employé', 14, startY);
  
  // Informations personnelles - décalées vers le bas
  doc.setFontSize(12);
  doc.text('Informations personnelles', 14, startY + 15);
  
  const personalInfoData = [
    ['Nom', employee.name || 'Non spécifié'],
    ['Email personnel', employee.personalEmail || 'Non spécifié'],
    ['Email professionnel', employee.professionalEmail || employee.email || 'Non spécifié'],
    ['Téléphone', employee.phone || 'Non spécifié'],
    ['Date de naissance', employee.birthDate || 'Non spécifié']
  ];
  
  // Utilisation de autoTable avec une configuration améliorée pour une meilleure visibilité
  autoTable(doc, {
    startY: startY + 20,
    head: [],
    body: personalInfoData,
    theme: 'plain',
    styles: { 
      fontSize: 10, 
      cellPadding: 5,
      textColor: [0, 0, 0] // Noir pour une meilleure visibilité
    },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Informations professionnelles
  // Use type assertion to access lastAutoTable
  const tableEndY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations professionnelles', 14, tableEndY);
  
  const professionalInfoData = [
    ['Poste', employee.position || 'Non spécifié'],
    ['Département', employee.department || 'Non spécifié'],
    ['Entreprise', employee.companyId || 'Non spécifié'],
    ['Date d\'embauche', employee.startDate || 'Non spécifié'],
    ['Statut', employee.status === 'active' ? 'Actif' : 
              employee.status === 'onLeave' ? 'En congé' : 
              employee.status === 'inactive' ? 'Inactif' : 'Non spécifié']
  ];
  
  autoTable(doc, {
    startY: tableEndY + 5,
    head: [],
    body: professionalInfoData,
    theme: 'plain',
    styles: { 
      fontSize: 10, 
      cellPadding: 5,
      textColor: [0, 0, 0] // Noir pour une meilleure visibilité
    },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 'auto' }
    }
  });
};
