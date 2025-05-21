
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
  
  // Document generation date
  doc.setFontSize(10);
  const today = new Date();
  doc.text(`Document généré le ${today.toLocaleDateString('fr-FR')}`, 14, 55);
  
  // "Fiche Employé" title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Fiche Employé', 14, 70);
  
  // Move employee name and status under "Fiche Employé"
  // Display employee status
  doc.setFontSize(10);
  doc.setTextColor('#22c55e'); // Green color for status
  doc.setFont('helvetica', 'bold');
  doc.text(`Statut: ${employee.status === 'active' ? 'Actif' : 
           employee.status === 'onLeave' ? 'En congé' : 
           employee.status === 'inactive' ? 'Inactif' : 'Non spécifié'}`, 14, 80);
  
  // Display employee name
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text(employee.name || 'Non spécifié', 14, 90);
  
  // Title for employee information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations de l\'employé', 14, 105);
  
  // Personal information section
  doc.setFontSize(14);
  doc.text('Informations personnelles', 14, 120);
  
  const personalInfoData = [
    ['Nom', employee.name || 'Non spécifié'],
    ['Email personnel', employee.personalEmail || 'Non spécifié'],
    ['Email professionnel', employee.professionalEmail || employee.email || 'Non spécifié'],
    ['Téléphone', employee.phone || 'Non spécifié'],
    ['Date de naissance', employee.birthDate || 'Non spécifié']
  ];
  
  autoTable(doc, {
    startY: 125,
    head: [],
    body: personalInfoData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Professional information section
  // Use type assertion to access lastAutoTable
  const tableEndY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations professionnelles', 14, tableEndY);
  
  const professionalInfoData = [
    ['Poste', employee.position || 'Non spécifié'],
    ['Département', employee.department || 'Non spécifié'],
    ['Entreprise', typeof employee.companyId === 'string' && !employee.companyId.includes('@') ? employee.companyId : 'Non spécifié'],
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
  
  // Add page number at the bottom
  const pageCount = doc.internal.pages.length - 1;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Page 1 sur ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
};
