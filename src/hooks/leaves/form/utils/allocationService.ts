
import { doc, getDoc, query, where, getDocs, collection, QuerySnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LeaveAllocation } from "@/hooks/leaves";
import { LeaveFormValues } from "@/components/leaves/form/types";
import { HR } from "@/lib/constants/collections";

/**
 * Service pour gérer les allocations de congés
 */
export const allocationService = {
  /**
   * Récupérer l'allocation existante pour un employé
   */
  fetchExistingAllocation: async (employeeId: string, year: number): Promise<{
    existingAllocation: (LeaveAllocation & { id: string }) | null;
    querySnapshot: QuerySnapshot;
  }> => {
    const allocationRef = collection(db, HR.LEAVE_ALLOCATIONS);
    const q = query(allocationRef, 
      where('employeeId', '==', employeeId), 
      where('year', '==', year)
    );
    const querySnapshot = await getDocs(q);
    
    let existingAllocation = null;
    if (!querySnapshot.empty) {
      existingAllocation = { 
        id: querySnapshot.docs[0].id, 
        ...querySnapshot.docs[0].data() 
      } as LeaveAllocation & { id: string };
    }
    
    return { existingAllocation, querySnapshot };
  },
  
  /**
   * Vérifier si l'employé a suffisamment de jours de congés disponibles
   */
  validateLeaveBalance: (
    existingAllocation: LeaveAllocation | null, 
    leaveType: string, 
    daysRequested: number
  ): { 
    hasEnoughLeaves: boolean; 
    errorMessage: string;
  } => {
    if (!existingAllocation) {
      return { 
        hasEnoughLeaves: false, 
        errorMessage: "Aucune allocation de congés trouvée pour cet employé." 
      };
    }
    
    if (leaveType === 'paid' && 
        existingAllocation.paidLeavesUsed + daysRequested > existingAllocation.paidLeavesTotal) {
      return {
        hasEnoughLeaves: false,
        errorMessage: `Solde de congés payés insuffisant. Il vous reste ${existingAllocation.paidLeavesTotal - existingAllocation.paidLeavesUsed} jours, vous demandez ${daysRequested} jours.`
      };
    } 
    
    if (leaveType === 'rtt' && 
        existingAllocation.rttUsed + daysRequested > existingAllocation.rttTotal) {
      return {
        hasEnoughLeaves: false,
        errorMessage: `Solde de RTT insuffisant. Il vous reste ${existingAllocation.rttTotal - existingAllocation.rttUsed} jours, vous demandez ${daysRequested} jours.`
      };
    }
    
    return { hasEnoughLeaves: true, errorMessage: "" };
  },
  
  /**
   * Préparer les données d'allocation pour la création/mise à jour
   */
  prepareAllocationData: (
    data: LeaveFormValues, 
    existingAllocation: LeaveAllocation | null, 
    currentYear: number, 
    userId?: string
  ): Omit<LeaveAllocation, 'id'> => {
    return {
      employeeId: data.employeeId,
      year: currentYear,
      paidLeavesTotal: data.paidDaysAllocated || (existingAllocation?.paidLeavesTotal || 0),
      paidLeavesUsed: existingAllocation?.paidLeavesUsed || 0,
      rttTotal: data.rttDaysAllocated || (existingAllocation?.rttTotal || 0),
      rttUsed: existingAllocation?.rttUsed || 0,
      updatedAt: new Date().toISOString(),
      // Ajouter updatedBy seulement s'il est défini
      ...(userId ? { updatedBy: userId } : {})
    };
  }
};
