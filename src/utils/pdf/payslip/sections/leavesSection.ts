
import jsPDF from 'jspdf';
import { LeaveAllocation } from '@/hooks/leaves/types';
import { LeaveBalances } from '../types';

/**
 * Extract leave balances from leave allocation data
 */
export const extractLeaveBalances = (leaveAllocation?: LeaveAllocation): LeaveBalances => {
  return {
    paidLeaves: {
      acquis: leaveAllocation ? leaveAllocation.paidLeavesTotal : 25,
      pris: leaveAllocation ? leaveAllocation.paidLeavesUsed : 0,
      restant: leaveAllocation ? 
        leaveAllocation.paidLeavesTotal - leaveAllocation.paidLeavesUsed : 25
    },
    rtt: {
      acquis: leaveAllocation ? leaveAllocation.rttTotal : 12, 
      pris: leaveAllocation ? leaveAllocation.rttUsed : 0,
      restant: leaveAllocation ? 
        leaveAllocation.rttTotal - leaveAllocation.rttUsed : 12
    }
  };
};

/**
 * Renders the leaves balance section on the payslip
 */
export const addLeavesSection = (doc: jsPDF, leaveAllocation: LeaveAllocation | undefined, startY: number): number => {
  let tableY = startY;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('SOLDES DES CONGÉS ET RTT', 14, tableY);
  tableY += 8;
  
  // Extract leave balances
  const { paidLeaves, rtt } = extractLeaveBalances(leaveAllocation);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Congés payés', 14, tableY);
  doc.text(`Acquis: ${paidLeaves.acquis}`, 60, tableY);
  doc.text(`Pris: ${paidLeaves.pris}`, 100, tableY);
  doc.text(`Solde: ${paidLeaves.restant}`, 140, tableY);
  tableY += 8;
  
  doc.text('RTT', 14, tableY);
  doc.text(`Acquis: ${rtt.acquis}`, 60, tableY);
  doc.text(`Pris: ${rtt.pris}`, 100, tableY);
  doc.text(`Solde: ${rtt.restant}`, 140, tableY);
  tableY += 16;
  
  return tableY;
};
