
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Employee } from '@/types/employee';

/**
 * Génère un PDF pour les informations de l'employé
 */
export const generateEmployeePdf = (employee: Employee, activeTab: string) => {
  // Initialisation du document PDF
  const doc = new jsPDF();
  
  // Définir les couleurs et styles
  const primaryColor = '#000000';
  const secondaryColor = '#666666';
  
  // Informations de l'entreprise (en-tête)
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor);
  doc.text('ENTREPRISE SARL', 14, 15);
  doc.text('123 Rue des Entreprises', 14, 20);
  doc.text('75000 Paris, France', 14, 25);
  doc.text('Tel: +33 1 23 45 67 89', 14, 30);
  doc.text('Email: contact@entreprise.fr', 14, 35);
  
  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 40, 196, 40);
  
  // Titre du document
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('Fiche Employé', 14, 50);
  
  // Status de l'employé
  let statusText = '';
  let statusColor = '';
  switch (employee.status) {
    case 'active':
      statusText = 'Actif';
      statusColor = '#22c55e'; // green
      break;
    case 'onLeave':
      statusText = 'En congé';
      statusColor = '#f59e0b'; // amber
      break;
    case 'inactive':
      statusText = 'Inactif';
      statusColor = '#ef4444'; // red
      break;
    default:
      statusText = 'Indéfini';
      statusColor = '#6b7280'; // gray
  }
  
  doc.setFontSize(12);
  doc.setTextColor(statusColor);
  doc.text(`Statut: ${statusText}`, 14, 57);
  
  // Nom de l'employé
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`${employee.name || 'Sans nom'}`, 14, 65);
  
  // Date de génération
  const today = new Date();
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor);
  doc.setFont('helvetica', 'normal');
  doc.text(`Document généré le ${today.toLocaleDateString('fr-FR')}`, 14, 72);
  
  // Contenu en fonction de l'onglet actif
  const startY = 85;
  
  switch (activeTab) {
    case 'informations':
      generateInformationsTab(doc, employee, startY);
      break;
    case 'documents':
      generateDocumentsTab(doc, startY);
      break;
    case 'competences':
      generateCompetencesTab(doc, startY);
      break;
    case 'horaires':
      generateHorairesTab(doc, startY);
      break;
    case 'conges':
      generateCongesTab(doc, startY);
      break;
    case 'evaluations':
      generateEvaluationsTab(doc, startY);
      break;
    default:
      generateInformationsTab(doc, employee, startY);
  }
  
  // Pied de page
  // Fix: Use the correct API to get the number of pages
  const pageCount = (doc as any).internal.pages.length - 1;
  doc.setFontSize(8);
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(secondaryColor);
    doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  }
  
  // Enregistrer le PDF
  const fileName = `employee_${employee.id}_${activeTab}_${today.getTime()}.pdf`;
  doc.save(fileName);
};

// Génère la section informations
const generateInformationsTab = (doc: jsPDF, employee: Employee, startY: number) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Informations de l\'employé', 14, startY);
  
  // Informations personnelles
  doc.setFontSize(14);
  doc.text('Informations personnelles', 14, startY + 15);
  
  const personalInfoData = [
    ['Nom', employee.name || 'Non spécifié'],
    ['Email personnel', employee.email || 'Non spécifié'],
    ['Email professionnel', 'Non spécifié'],
    ['Téléphone', employee.phone || 'Non spécifié'],
    ['Date de naissance', 'Non spécifié']
  ];
  
  autoTable(doc, {
    startY: startY + 20,
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
  // Fix: Use type assertion to access lastAutoTable
  const tableEndY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations professionnelles', 14, tableEndY);
  
  const professionalInfoData = [
    ['Poste', employee.position || 'Non spécifié'],
    ['Département', employee.department || 'Non spécifié'],
    ['Date d\'embauche', employee.startDate || '15 mai 2025'],
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

// Génère la section documents
const generateDocumentsTab = (doc: jsPDF, startY: number) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Documents', 14, startY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucun document disponible pour cet employé.', 14, startY + 15);
};

// Génère la section compétences
const generateCompetencesTab = (doc: jsPDF, startY: number) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Compétences', 14, startY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucune compétence enregistrée pour cet employé.', 14, startY + 15);
};

// Génère la section horaires
const generateHorairesTab = (doc: jsPDF, startY: number) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Horaires', 14, startY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucun horaire défini pour cet employé.', 14, startY + 15);
};

// Génère la section congés
const generateCongesTab = (doc: jsPDF, startY: number) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Congés', 14, startY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucun congé enregistré pour cet employé.', 14, startY + 15);
};

// Génère la section évaluations
const generateEvaluationsTab = (doc: jsPDF, startY: number) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Évaluations', 14, startY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucune évaluation disponible pour cet employé.', 14, startY + 15);
};
