
import jsPDF from 'jspdf';
import { Leave } from '@/lib/constants';
import autoTable from 'jspdf-autotable';

/**
 * Génère la section congés
 */
export const generateCongesTab = (doc: jsPDF, startY: number, leaves?: Leave[]) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Congés', 14, startY);
  
  if (!leaves || leaves.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Aucun congé enregistré pour cet employé.', 14, startY + 15);
    return;
  }
  
  // Calculate total leave days
  const totalDays = leaves.reduce((acc, leave) => {
    if (leave.startDate && leave.endDate && leave.status === 'approved') {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day
      return acc + diffDays;
    }
    return acc;
  }, 0);
  
  // Add summary of leave days
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total des jours de congés: ${totalDays} jours`, 14, startY + 12);
  
  // Convert leave type to French
  const leaveTypeToFrench = (type: string): string => {
    switch (type) {
      case 'annual': return 'Congés annuels';
      case 'sick': return 'Maladie';
      case 'maternity': return 'Maternité';
      case 'paternity': return 'Paternité';
      default: return 'Autre';
    }
  };
  
  // Convert leave status to French
  const leaveStatusToFrench = (status: string): string => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Refusé';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };
  
  // Calculate days between dates
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };
  
  // Create table data
  const tableData = leaves.map((leave) => [
    leaveTypeToFrench(leave.type),
    leave.startDate,
    leave.endDate,
    calculateDays(leave.startDate, leave.endDate).toString(),
    leaveStatusToFrench(leave.status)
  ]);
  
  // Add table to PDF
  autoTable(doc, {
    startY: startY + 20,
    head: [['Type', 'Date début', 'Date fin', 'Jours', 'Statut']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [50, 50, 50],
      fontStyle: 'bold'
    }
  });
};
