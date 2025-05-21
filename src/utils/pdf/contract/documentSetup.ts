
import jsPDF from 'jspdf';
import { Company } from '@/types/company';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Sets up the header content of the contract document
 */
export const setupContractHeader = (
  doc: jsPDF, 
  company?: Company,
  margin: number = 20
): number => {
  let yPosition = margin;
  
  // Nom de l'entreprise à gauche
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(company?.name || 'ENTREPRISE', margin, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  if (company?.address) {
    doc.text(company.address, margin, yPosition);
    yPosition += 5;
  }
  
  const locationParts = [];
  if (company?.postalCode) locationParts.push(company.postalCode);
  if (company?.city) locationParts.push(company.city);
  if (locationParts.length > 0) {
    doc.text(locationParts.join(' '), margin, yPosition);
    yPosition += 5;
  }
  
  if (company?.phone) {
    doc.text(`Tél: ${company.phone}`, margin, yPosition);
    yPosition += 5;
  }
  
  if (company?.email) {
    doc.text(`Email: ${company.email}`, margin, yPosition);
    yPosition += 5;
  }
  
  // Logo de l'entreprise à droite
  if (company?.logoUrl) {
    try {
      doc.addImage(
        company.logoUrl,
        'JPEG',
        doc.internal.pageSize.width - 60,
        margin,
        40,
        25
      );
    } catch (err) {
      console.error("Erreur lors de l'ajout du logo:", err);
    }
  } else if (company?.logo?.base64) {
    try {
      doc.addImage(
        company.logo.base64,
        'JPEG',
        doc.internal.pageSize.width - 60,
        margin,
        40,
        25
      );
    } catch (err) {
      console.error("Erreur lors de l'ajout du logo:", err);
    }
  }
  
  return yPosition;
};

/**
 * Adds contract title and date
 */
export const addContractTitle = (
  doc: jsPDF, 
  contractType: string, 
  company?: Company,
  margin: number = 20
): number => {
  // Titre du contrat
  let yPosition = 65;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  
  let contractTitle = 'CONTRAT DE TRAVAIL';
  switch(contractType) {
    case 'CDI':
      contractTitle += ' À DURÉE INDÉTERMINÉE';
      break;
    case 'CDD':
      contractTitle += ' À DURÉE DÉTERMINÉE';
      break;
    case 'Interim':
      contractTitle += ' INTÉRIMAIRE';
      break;
    case 'Stage':
      contractTitle = 'CONVENTION DE STAGE';
      break;
    case 'Apprentissage':
      contractTitle = 'CONTRAT D\'APPRENTISSAGE';
      break;
    case 'Freelance':
      contractTitle = 'CONTRAT DE PRESTATION DE SERVICES';
      break;
  }
  
  // Centrer le titre
  const titleWidth = doc.getStringUnitWidth(contractTitle) * doc.getFontSize() / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  doc.text(contractTitle, titleX, yPosition);
  
  yPosition += 20;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Date du contrat
  const today = format(new Date(), 'dd MMMM yyyy', { locale: fr });
  doc.text(`Fait à ${company?.city || 'Paris'}, le ${today}`, margin, yPosition);
  
  return yPosition + 15;
};

/**
 * Adds parties information
 */
export const addPartiesSection = (
  doc: jsPDF, 
  employeeName: string,
  company?: Company,
  margin: number = 20,
  startY: number = 100
): number => {
  let yPosition = startY;
  
  doc.text('ENTRE LES SOUSSIGNÉS :', margin, yPosition);
  yPosition += 10;
  
  doc.text(`La société ${company?.name || 'ENTREPRISE'}, ${company?.type || ''} ${company?.industry ? `dans le secteur ${company.industry}` : ''}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Siège social : ${company?.address || ''}, ${company?.postalCode || ''} ${company?.city || ''}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Représentée par son dirigeant légal,`, margin, yPosition);
  yPosition += 7;
  doc.text(`Ci-après dénommée "L'EMPLOYEUR"`, margin, yPosition);
  
  yPosition += 12;
  doc.text(`ET`, margin, yPosition);
  
  yPosition += 12;
  doc.text(`${employeeName}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Ci-après dénommé(e) "LE SALARIÉ"`, margin, yPosition);
  
  yPosition += 12;
  doc.text(`IL A ÉTÉ CONVENU CE QUI SUIT :`, margin, yPosition);
  
  return yPosition + 15;
};

/**
 * Adds collective agreement reference if specified
 */
export const addCollectiveAgreement = (
  doc: jsPDF,
  conventionCollective?: string,
  margin: number = 20,
  startY: number = 145
): number => {
  let yPosition = startY;
  
  if (conventionCollective) {
    doc.setFont('helvetica', 'bold');
    doc.text('Convention collective applicable', margin, yPosition);
    yPosition += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Le présent contrat est soumis à la convention collective ${conventionCollective}.`, margin, yPosition);
    yPosition += 10;
  }
  
  return yPosition;
};

/**
 * Adds page footer with legal mention
 */
export const addPageFooter = (doc: jsPDF): void => {
  // Pied de page avec mention légale
  doc.setFontSize(8);
  doc.text('Ce document est strictement confidentiel et établi conformément au droit du travail français. Il ne constitue pas un conseil juridique.',
    doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  
  // Pied de page avec numéros de page
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} / ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 20, { align: 'center' });
  }
};
