
import jsPDF from 'jspdf';
import { Company } from '@/types/company';
import { toast } from '@/components/ui/use-toast';

/**
 * Generate a PDF with company information
 */
export const generateCompanyPdf = (company: Company) => {
  try {
    // Initialize PDF document
    const doc = new jsPDF();
    
    // Set up document properties
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Fiche Entreprise', 15, 20);
    
    // Add company name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(company.name, 15, 30);
    
    // Add status
    doc.setFontSize(10);
    let statusText = 'Statut inconnu';
    if (company.status === 'active') statusText = 'Actif';
    else if (company.status === 'pending') statusText = 'En attente';
    else if (company.status === 'inactive') statusText = 'Inactif';
    doc.text(`Statut: ${statusText}`, 15, 38);
    
    // Add industry and registration date
    doc.setFont('helvetica', 'normal');
    if (company.industry) {
      doc.text(`Secteur: ${company.industry}`, 15, 46);
    }
    if (company.registrationDate) {
      const date = new Date(company.registrationDate);
      doc.text(`Date d'enregistrement: ${date.toLocaleDateString()}`, 15, 54);
    }
    
    // Add a separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 60, 195, 60);
    
    // Add description section
    if (company.description) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Description', 15, 70);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      const splitDescription = doc.splitTextToSize(company.description, 170);
      doc.text(splitDescription, 15, 78);
    }
    
    // Add contact information section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Informations de contact', 15, 110);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    let contactY = 118;
    if (company.email) {
      doc.text(`Email: ${company.email}`, 15, contactY);
      contactY += 8;
    }
    if (company.phone) {
      doc.text(`Téléphone: ${company.phone}`, 15, contactY);
      contactY += 8;
    }
    if (company.website) {
      doc.text(`Site web: ${company.website}`, 15, contactY);
      contactY += 8;
    }
    
    // Add address section
    if (company.address || company.city || company.postalCode || company.country) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Adresse', 15, contactY + 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      let addressY = contactY + 18;
      if (company.address) {
        doc.text(company.address, 15, addressY);
        addressY += 6;
      }
      
      let cityPostalText = '';
      if (company.postalCode) cityPostalText += company.postalCode;
      if (company.city) cityPostalText += cityPostalText ? ` ${company.city}` : company.city;
      
      if (cityPostalText) {
        doc.text(cityPostalText, 15, addressY);
        addressY += 6;
      }
      
      if (company.country) {
        doc.text(company.country, 15, addressY);
      }
    }
    
    // Add footer
    doc.setFontSize(8);
    doc.text(`Document généré le ${new Date().toLocaleDateString()}`, 15, 280);
    
    // Save the PDF
    const fileName = `company_${company.id || 'unknown'}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Generate a PDF with company information and display toast notifications
 */
export const exportCompanyToPdf = (company: Company) => {
  try {
    const success = generateCompanyPdf(company);
    
    if (success) {
      toast({
        title: "Exportation réussie",
        description: "Le document PDF a été généré avec succès",
      });
      return true;
    } else {
      throw new Error("Échec de génération du PDF");
    }
  } catch (error) {
    console.error("Erreur lors de l'exportation PDF:", error);
    toast({
      title: "Erreur d'exportation",
      description: "Impossible de générer le document PDF",
      variant: "destructive"
    });
    return false;
  }
};
