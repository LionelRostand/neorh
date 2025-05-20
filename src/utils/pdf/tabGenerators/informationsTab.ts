
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Employee } from '@/types/employee';

/**
 * Génère la section informations
 */
export const generateInformationsTab = (doc: jsPDF, employee: Employee) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Informations de l\'employé', 14, 30);
  
  // Informations personnelles
  doc.setFontSize(14);
  doc.text('Informations personnelles', 14, 45);
  
  const personalInfoData = [
    ['Nom', employee.name || 'Non spécifié'],
    ['Email personnel', employee.personalEmail || 'Non spécifié'],
    ['Téléphone', employee.phone || 'Non spécifié'],
    ['Date de naissance', employee.birthDate || 'Non spécifié']
  ];
  
  autoTable(doc, {
    startY: 50,
    head: [],
    body: personalInfoData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Informations professionnelles
  // Use type assertion to access lastAutoTable
  const tableEndY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations professionnelles', 14, tableEndY);
  
  const professionalInfoData = [
    ['Poste', employee.position || 'Non spécifié'],
    ['Département', employee.department || 'Non spécifié'],
    ['Entreprise', employee.company || 'Non spécifié'],
    ['Date d\'embauche', employee.startDate || 'Non spécifié'],
    ['Statut', employee.status === 'active' ? 'Actif' : 
              employee.status === 'onLeave' ? 'En congé' : 
              employee.status === 'inactive' ? 'Inactif' : 'Inconnu']
  ];
  
  autoTable(doc, {
    startY: tableEndY + 5,
    head: [],
    body: professionalInfoData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });
};
