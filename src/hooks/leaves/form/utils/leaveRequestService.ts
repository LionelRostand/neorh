
import { LeaveFormValues } from "@/components/leaves/form/types";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HR } from "@/lib/constants/collections";

/**
 * Service pour gérer les demandes de congés
 */
export const leaveRequestService = {
  /**
   * Créer une demande de congé standard
   */
  createLeaveRequest: async (
    data: LeaveFormValues, 
    managerId: string | undefined, 
    paidDaysUsed: number, 
    rttDaysUsed: number, 
    diffDays: number,
    startDateStr: string, 
    endDateStr: string
  ) => {
    // Créer la demande de congé
    const leaveData = {
      employeeId: data.employeeId,
      type: data.type || 'paid',
      startDate: startDateStr,
      endDate: endDateStr,
      status: 'pending', // Les demandes sont en attente par défaut
      comment: data.comment || '',
      managerId,
      createdAt: new Date().toISOString(),
      daysRequested: diffDays,
      paidDaysUsed,
      rttDaysUsed
    };
    
    await addDoc(collection(db, HR.LEAVES), leaveData);
  },
  
  /**
   * Créer une allocation de congés
   */
  createLeaveAllocation: async (
    data: LeaveFormValues,
    managerId: string | undefined,
    startDateStr: string,
    endDateStr: string
  ) => {
    // Créer une entrée dans hr_leaves pour enregistrer l'allocation
    await addDoc(collection(db, HR.LEAVES), {
      employeeId: data.employeeId,
      type: 'allocation',
      startDate: startDateStr,
      endDate: endDateStr,
      status: 'approved', // Les allocations sont approuvées par défaut
      comment: data.comment || '',
      managerId,
      createdAt: new Date().toISOString(),
      paidDaysAllocated: data.paidDaysAllocated || 0,
      rttDaysAllocated: data.rttDaysAllocated || 0,
      isAllocation: true
    });
  }
};
