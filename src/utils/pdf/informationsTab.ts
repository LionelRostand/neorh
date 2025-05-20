
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Employee } from '@/types/employee';

/**
 * Génère la section informations
 */
export const generateInformationsTab = (doc: jsPDF, employee: Employee) => {
  // Position de départ après l'en-tête
  const startY = 85;
  
  doc.setFontSize(24);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Informations de l\'employé', 14, startY);
  
  doc.setFontSize(20);
  doc.text('Fiche Employé', 14, startY + 15);
  
  // Afficher le statut à côté du titre
  doc.setFontSize(14);
  doc.setTextColor('#22c55e'); // Couleur verte pour "Actif"
  doc.text(`Statut: ${employee.status === 'active' ? 'Actif' : 
           employee.status === 'onLeave' ? 'En congé' : 
           employee.status === 'inactive' ? 'Inactif' : 'Inconnu'}`, 14, startY + 30);
  doc.setTextColor('#000000'); // Réinitialiser la couleur du texte
  
  // Informations personnelles
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations personnelles', 14, startY + 45);
  
  // Tableau des informations personnelles
  const personalInfoData = [
    ['Nom', employee.name || 'Non spécifié'],
    ['Email', employee.personalEmail || employee.email || 'Non spécifié'],
    ['Téléphone', employee.phone || 'Non spécifié'],
    ['Date de naissance', employee.birthDate || 'Non spécifié']
  ];
  
  autoTable(doc, {
    startY: startY + 50,
    head: [],
    body: personalInfoData,
    theme: 'plain',
    styles: { fontSize: 12, cellPadding: 5 },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 150 },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Informations professionnelles
  // Use type assertion to access lastAutoTable
  const tableEndY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations professionnelles', 14, tableEndY);
  
  const professionalInfoData = [
    ['Poste', employee.position || 'Non spécifié'],
    ['Département', employee.department || 'Non spécifié'],
    ['Entreprise', employee.companyId || 'Non spécifié'],
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
    styles: { fontSize: 12, cellPadding: 5 },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 150 },
      1: { cellWidth: 'auto' }
    }
  });
};
