import jsPDF from 'jspdf';
import { Company } from '@/types/company';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Document } from '@/lib/constants';

interface ContractData {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  departmentId: string;
  position: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  salary: string;
  conventionCollective?: string;
  status: 'draft' | 'pending_signature' | 'active' | 'signed';
  signedByEmployee?: boolean;
  signedByEmployer?: boolean;
}

/**
 * Génère un PDF de contrat selon le droit français
 */
export const generateContractPdf = (contractData: ContractData, company?: Company) => {
  // Création du document PDF
  const doc = new jsPDF();
  
  // Configuration du document
  doc.setProperties({
    title: `Contrat de travail - ${contractData.employeeName}`,
    subject: `Contrat de travail ${contractData.type}`,
    author: company?.name || 'Système RH',
    creator: 'Application RH'
  });
  
  // Marges
  const margin = 20;
  let yPosition = margin;
  
  // Style de texte par défaut
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor('#000000');
  
  // En-tête avec logo et nom de l'entreprise
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
  
  // Titre du contrat
  yPosition = 65;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  
  let contractTitle = 'CONTRAT DE TRAVAIL';
  switch(contractData.type) {
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
  
  yPosition += 15;
  
  // Parties concernées
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
  doc.text(`${contractData.employeeName}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Ci-après dénommé(e) "LE SALARIÉ"`, margin, yPosition);
  
  yPosition += 12;
  doc.text(`IL A ÉTÉ CONVENU CE QUI SUIT :`, margin, yPosition);
  
  yPosition += 15;
  
  // Référence à la convention collective si spécifiée
  if (contractData.conventionCollective) {
    doc.setFont('helvetica', 'bold');
    doc.text('Convention collective applicable', margin, yPosition);
    yPosition += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Le présent contrat est soumis à la convention collective ${contractData.conventionCollective}.`, margin, yPosition);
    yPosition += 10;
  }
  
  // Contenu du contrat selon le type
  switch(contractData.type) {
    case 'CDI':
      yPosition = generateCDIContent(doc, contractData, margin, yPosition);
      break;
    case 'CDD':
      yPosition = generateCDDContent(doc, contractData, margin, yPosition);
      break;
    case 'Interim':
      yPosition = generateInterimContent(doc, contractData, margin, yPosition);
      break;
    case 'Stage':
      yPosition = generateStageContent(doc, contractData, margin, yPosition);
      break;
    case 'Apprentissage':
      yPosition = generateApprentissageContent(doc, contractData, margin, yPosition);
      break;
    case 'Freelance':
      yPosition = generateFreelanceContent(doc, contractData, margin, yPosition);
      break;
    default:
      yPosition = generateDefaultContent(doc, contractData, margin, yPosition);
  }
  
  // Ajout des articles supplémentaires
  yPosition = addAdditionalArticles(doc, margin, yPosition);
  
  // Ajout des signatures
  yPosition = addSignatureSection(doc, margin, yPosition);
  
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
  
  // Enregistrement du PDF
  const fileName = `contrat_${contractData.type}_${contractData.employeeName.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
  
  return {
    fileName,
    pdfData: doc.output('blob'),
    pdfBase64: doc.output('datauristring')
  };
};

/**
 * Ajoute les articles supplémentaires visibles sur la capture d'écran
 */
const addAdditionalArticles = (doc: jsPDF, margin: number, startY: number): number => {
  let yPosition = startY;
  
  // Article 5 - Horaires de travail
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#003366');
  doc.text('Article 5 - Horaires de travail', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#000000');
  doc.text('Le/La Salarié(e) sera soumis(e) à l\'horaire en vigueur dans l\'entreprise, soit actuellement 35 heures hebdomadaire.', margin, yPosition);
  yPosition += 7;
  doc.text('- Du lundi au vendredi : de 9h00 à 17h00, avec une pause déjeuner d\'une heure.', margin, yPosition);
  yPosition += 15;
  
  // Article 6 - Congés payés
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#003366');
  doc.text('Article 6 - Congés payés', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal'); 
  doc.setTextColor('#000000');
  doc.text('Le/La Salarié(e) bénéficiera des congés payés institués par les dispositions légales et conventionnelles, soit 2,5 jours', margin, yPosition);
  yPosition += 7;
  doc.text('ouvrables par mois de travail effectif.', margin, yPosition);
  yPosition += 15;
  
  // Article 7 - Obligations professionnelles
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#003366');
  doc.text('Article 7 - Obligations professionnelles', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#000000');
  doc.text('Le/La Salarié(e) s\'engage à respecter les directives et instructions émanant de la Direction et à se conformer aux règles', margin, yPosition);
  yPosition += 7;
  doc.text('en vigueur au sein de l\'entreprise.', margin, yPosition);
  yPosition += 10;
  doc.text('Le/La Salarié(e) s\'engage à informer l\'Employeur, sans délai, de tout changement qui interviendrait dans les situations', margin, yPosition);
  yPosition += 7;
  doc.text('personnelles qui ont été déclarées au moment de l\'engagement.', margin, yPosition);
  
  return yPosition + 20;
};

/**
 * Ajoute la section des signatures au contrat
 */
const addSignatureSection = (doc: jsPDF, margin: number, startY: number): number => {
  let yPosition = startY;
  
  // Section signatures
  doc.text('Fait en deux exemplaires originaux à [Ville], le [date]', margin, yPosition);
  
  yPosition += 30;
  
  // Créer deux colonnes pour les signatures
  const middleX = doc.internal.pageSize.width / 2;
  
  // Signature de l'employeur (colonne gauche)
  doc.text('Signature de l\'Employeur', margin, yPosition);
  doc.text('Signature du/de la Salarié(e)', middleX + 10, yPosition);
  
  yPosition += 7;
  
  // Mention "Lu et approuvé"
  doc.text('Précédée de la mention « Lu et approuvé »', margin, yPosition);
  doc.text('Précédée de la mention « Lu et approuvé »', middleX + 10, yPosition);
  
  // Lignes de signature
  yPosition -= 15;
  doc.line(margin, yPosition + 30, margin + 80, yPosition + 30);
  doc.line(middleX + 10, yPosition + 30, middleX + 90, yPosition + 30);
  
  return yPosition + 40;
};

/**
 * Génère le contenu d'un contrat CDI
 */
const generateCDIContent = (doc: jsPDF, contractData: ContractData, margin: number, startY: number): number => {
  let yPosition = startY;
  
  // Article 1 - Engagement
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#003366');
  doc.text('Article 1 - Engagement', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#000000');
  doc.text(`Le salarié est engagé en qualité de ${contractData.position} au sein du département ${contractData.departmentName || ''}.`, margin, yPosition);
  yPosition += 7;
  doc.text('Ce contrat est conclu pour une durée indéterminée. Il prendra effet le ' + 
    format(new Date(contractData.startDate), 'dd MMMM yyyy', { locale: fr }) + '.', margin, yPosition);
  
  // Article 2 - Période d'essai
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#003366');
  doc.text('Article 2 - Période d\'essai', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#000000');
  doc.text(`Le présent contrat est soumis à une période d'essai de trois mois renouvelable une fois.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Durant cette période, chacune des parties pourra rompre le contrat sans indemnité ni préavis.`, margin, yPosition);
  
  // Article 3 - Fonctions
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#003366');
  doc.text('Article 3 - Fonctions', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#000000');
  doc.text(`Le salarié exercera les fonctions de ${contractData.position}.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Ces fonctions sont susceptibles d'évoluer en fonction des besoins de l'entreprise.`, margin, yPosition);
  
  // Article 4 - Rémunération
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#003366');
  doc.text('Article 4 - Rémunération', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#000000');
  doc.text(`La rémunération brute annuelle du salarié est fixée à ${contractData.salary} euros.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Cette rémunération sera versée sur 12 mois, à la fin de chaque mois.`, margin, yPosition);
  
  return yPosition + 10;
};

/**
 * Génère le contenu d'un contrat CDD
 */
const generateCDDContent = (doc: jsPDF, contractData: ContractData, margin: number, startY: number): number => {
  let yPosition = startY;
  
  // Article 1 - Engagement
  doc.setFont('helvetica', 'bold');
  doc.text('Article 1 - Engagement et durée', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Le salarié est engagé en qualité de ${contractData.position} au sein du département ${contractData.departmentName || ''}.`, margin, yPosition);
  yPosition += 7;
  
  const startDateFormatted = format(new Date(contractData.startDate), 'dd MMMM yyyy', { locale: fr });
  let endDateText = "indéterminée";
  
  if (contractData.endDate) {
    endDateText = format(new Date(contractData.endDate), 'dd MMMM yyyy', { locale: fr });
  }
  
  doc.text(`Ce contrat est conclu pour une durée déterminée. Il prendra effet le ${startDateFormatted}`, margin, yPosition);
  yPosition += 7;
  doc.text(`et se terminera le ${endDateText}.`, margin, yPosition);
  
  // Article 2 - Motif du recours au CDD
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 2 - Motif du recours au CDD', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Le présent contrat est conclu pour le motif suivant : accroissement temporaire d'activité.`, margin, yPosition);
  
  // Article 3 - Période d'essai
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 3 - Période d\'essai', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Le présent contrat est soumis à une période d'essai d'un mois.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Durant cette période, chacune des parties pourra rompre le contrat sans indemnité ni préavis.`, margin, yPosition);
  
  // Article 4 - Fonctions
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 4 - Fonctions', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Le salarié exercera les fonctions de ${contractData.position}.`, margin, yPosition);
  
  // Article 5 - Rémunération
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 5 - Rémunération', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`La rémunération brute mensuelle du salarié est fixée à ${(parseInt(contractData.salary)/12).toFixed(2)} euros.`, margin, yPosition);
  
  // Article 6 - Indemnité de fin de contrat
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 6 - Indemnité de fin de contrat', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`À l'issue du contrat, le salarié percevra une indemnité de fin de contrat égale à 10% de`, margin, yPosition);
  yPosition += 7;
  doc.text(`la rémunération totale brute qui lui aura été versée pendant la durée du contrat.`, margin, yPosition);
  
  // Ajouter le reste des articles similaires au CDI...
  
  return yPosition + 20;
};

/**
 * Génère le contenu d'un contrat d'intérim
 */
const generateInterimContent = (doc: jsPDF, contractData: ContractData, margin: number, startY: number): number => {
  let yPosition = startY;
  
  // Contenu simplifié pour intérim
  doc.setFont('helvetica', 'bold');
  doc.text('Contrat de mission intérimaire', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Mission: ${contractData.position}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Durée: Du ${format(new Date(contractData.startDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  
  if (contractData.endDate) {
    yPosition += 7;
    doc.text(`au ${format(new Date(contractData.endDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  }
  
  yPosition += 10;
  doc.text(`Rémunération: ${contractData.salary} € brut annuel`, margin, yPosition);
  
  return yPosition + 30;
};

/**
 * Génère le contenu d'une convention de stage
 */
const generateStageContent = (doc: jsPDF, contractData: ContractData, margin: number, startY: number): number => {
  let yPosition = startY;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Convention de stage', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Stagiaire: ${contractData.employeeName}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Poste: ${contractData.position}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Période: Du ${format(new Date(contractData.startDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  
  if (contractData.endDate) {
    yPosition += 7;
    doc.text(`au ${format(new Date(contractData.endDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  }
  
  yPosition += 10;
  doc.text(`Gratification: ${contractData.salary} €`, margin, yPosition);
  
  return yPosition + 30;
};

/**
 * Génère le contenu d'un contrat d'apprentissage
 */
const generateApprentissageContent = (doc: jsPDF, contractData: ContractData, margin: number, startY: number): number => {
  let yPosition = startY;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Contrat d\'apprentissage', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Apprenti: ${contractData.employeeName}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Formation: ${contractData.position}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Durée: Du ${format(new Date(contractData.startDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  
  if (contractData.endDate) {
    yPosition += 7;
    doc.text(`au ${format(new Date(contractData.endDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  }
  
  yPosition += 10;
  doc.text(`Rémunération: ${contractData.salary} € brut annuel`, margin, yPosition);
  
  return yPosition + 30;
};

/**
 * Génère le contenu d'un contrat de freelance
 */
const generateFreelanceContent = (doc: jsPDF, contractData: ContractData, margin: number, startY: number): number => {
  let yPosition = startY;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Contrat de prestation de services', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Prestataire: ${contractData.employeeName}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Mission: ${contractData.position}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Début de la prestation: ${format(new Date(contractData.startDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  
  if (contractData.endDate) {
    yPosition += 7;
    doc.text(`Fin de la prestation: ${format(new Date(contractData.endDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  }
  
  yPosition += 10;
  doc.text(`Montant des honoraires: ${contractData.salary} € HT`, margin, yPosition);
  
  return yPosition + 30;
};

/**
 * Génère un contenu par défaut
 */
const generateDefaultContent = (doc: jsPDF, contractData: ContractData, margin: number, startY: number): number => {
  let yPosition = startY;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Contrat de travail', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Employé(e): ${contractData.employeeName}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Poste: ${contractData.position}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Type de contrat: ${contractData.type}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Date de début: ${format(new Date(contractData.startDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  
  if (contractData.endDate) {
    yPosition += 7;
    doc.text(`Date de fin: ${format(new Date(contractData.endDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  }
  
  yPosition += 10;
  doc.text(`Rémunération: ${contractData.salary} € brut annuel`, margin, yPosition);
  
  return yPosition + 30;
};

/**
 * Sauvegarde le contrat dans Firestore et retourne un objet Document
 */
export const saveContractAsDocument = async (
  contractData: ContractData,
  pdfData: { fileName: string, pdfBase64: string },
  firestore: any
): Promise<Document> => {
  try {
    // Créer un objet document pour la collection hr_documents
    const document: Document = {
      id: contractData.id || Date.now().toString(),
      title: `Contrat ${contractData.type} - ${contractData.employeeName}`,
      category: 'contracts',
      fileUrl: pdfData.pdfBase64,
      fileType: 'application/pdf',
      uploadDate: new Date().toISOString(),
      status: contractData.status || 'active',
      employeeId: contractData.employeeId,
      employeeName: contractData.employeeName,
      contractId: contractData.id,
      description: `Contrat de travail ${contractData.type} pour ${contractData.position}`,
      signedByEmployee: contractData.signedByEmployee || false,
      signedByEmployer: contractData.signedByEmployer || false,
    };
    
    // Sauvegarder le document
    await firestore.add(document);
    
    return document;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du document de contrat:', error);
    throw error;
  }
};
