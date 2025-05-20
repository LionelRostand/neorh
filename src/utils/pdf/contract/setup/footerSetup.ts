
import jsPDF from 'jspdf';

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
