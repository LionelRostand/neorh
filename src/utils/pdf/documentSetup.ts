
import jsPDF from 'jspdf';
import { Company } from '@/types/company';

/**
 * Configure basic document settings like header, company info, etc.
 */
export const setupDocument = (
  doc: jsPDF, 
  title: string, 
  subtitle?: string, 
  statusText?: string, 
  statusColor?: string, 
  company?: Company
) => {
  // Définir les couleurs et styles pour une meilleure visibilité
  const primaryColor = '#000000'; // Noir pur pour le texte principal
  const secondaryColor = '#333333'; // Gris foncé pour le texte secondaire
  const statusStyle = statusColor || '#22c55e';
  
  // Informations de l'entreprise (en-tête)
  doc.setFontSize(11);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  
  if (company) {
    // Use actual company data if provided
    doc.text(company.name || 'ENTREPRISE', 14, 20);
    
    doc.setFontSize(9);
    doc.setTextColor(secondaryColor);
    doc.setFont('helvetica', 'normal');
    
    // Position Y de départ pour les informations supplémentaires
    let infoY = 25;
    
    if (company.address) {
      doc.text(company.address, 14, infoY);
      infoY += 5;
    }
    
    const locationParts = [];
    if (company.postalCode) locationParts.push(company.postalCode);
    if (company.city) locationParts.push(company.city);
    if (company.country) locationParts.push(company.country);
    const locationText = locationParts.join(', ');
    
    if (locationText) {
      doc.text(locationText, 14, infoY);
      infoY += 5;
    }
    
    // Téléphone
    if (company.phone) {
      doc.text(`Tél: ${company.phone}`, 14, infoY);
      infoY += 5;
    }
    
    // Email de l'entreprise
    if (company.email) {
      doc.text(`Email: ${company.email}`, 14, infoY);
      infoY += 5;
    }
    
    // Add company logo if available - déplacé à droite
    if (company.logoUrl) {
      try {
        doc.addImage(
          company.logoUrl, 
          'JPEG', 
          doc.internal.pageSize.width - 60, 
          15, 
          40, 
          25, 
          undefined, 
          'FAST'
        );
      } catch (err) {
        console.error('Error adding logo to PDF:', err);
      }
    } else if (company.logo?.base64) {
      try {
        doc.addImage(
          company.logo.base64,
          'JPEG',
          doc.internal.pageSize.width - 60, 
          15, 
          40, 
          25, 
          undefined, 
          'FAST'
        );
      } catch (err) {
        console.error('Error adding base64 logo to PDF:', err);
      }
    }
  } else {
    // Default company info if none provided
    doc.text('ENTREPRISE', 14, 20);
    
    doc.setFontSize(9);
    doc.setTextColor(secondaryColor);
    doc.setFont('helvetica', 'normal');
    
    doc.text('123 Rue des Entreprises', 14, 25);
    doc.text('75000 Paris, France', 14, 30);
    doc.text('Tél: +33123456789', 14, 35);
    doc.text('Email: contact@entreprise.fr', 14, 40);
  }
  
  // Titre du document - Fiche Employé
  doc.setFontSize(16);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Fiche Employé', 14, 65);
  
  // Statut - ajusté pour être à côté de "Statut:" comme dans le modèle
  if (statusText) {
    doc.setTextColor(primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Statut:', 14, 75);
    doc.setTextColor(statusStyle);
    doc.setFont('helvetica', 'bold');
    doc.text(statusText, 50, 75);
  }
  
  // Sous-titre (nom de l'employé) - ajusté pour être sous le statut
  if (subtitle) {
    doc.setTextColor(primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(subtitle, 14, 85);
  }
  
  // Date de génération - ajustée pour être sous le nom de l'employé
  const today = new Date();
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor);
  doc.setFont('helvetica', 'normal');
  doc.text(`Document généré le ${today.toLocaleDateString('fr-FR')}`, 14, 95);

  return doc;
};

/**
 * Add footer with page numbers to all pages
 */
export const addPageFooter = (doc: jsPDF) => {
  // Get the correct page count
  const pageCount = (doc as any).internal.pages.length - 1;
  doc.setFontSize(8);
  
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor('#000000'); // Noir pur pour une meilleure visibilité
    doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  }

  return doc;
};
