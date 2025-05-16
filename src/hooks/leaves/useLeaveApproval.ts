
import { useCallback } from 'react';
import { useFirestore } from '@/hooks/firestore';
import { LeaveAllocation } from './types';
import { Leave } from '@/types/firebase'; // Updated import path
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useLeaveApproval = () => {
  const { update: updateLeave } = useFirestore<Leave>('hr_leaves');
  
  const approveLeave = useCallback(async (leaveId: string) => {
    try {
      // 1. Récupérer les détails de la demande de congé
      const leaveRef = doc(db, 'hr_leaves', leaveId);
      const leaveSnap = await getDoc(leaveRef);
      
      if (!leaveSnap.exists()) {
        showErrorToast("Demande de congé introuvable");
        return false;
      }
      
      const leaveData = leaveSnap.data() as Leave;
      const { employeeId, type, daysRequested, paidDaysUsed = 0, rttDaysUsed = 0 } = leaveData;
      
      // 2. Récupérer l'allocation de congés pour l'employé
      const currentYear = new Date().getFullYear();
      const allocationsRef = collection(db, 'hr_leave_allocations');
      const q = query(allocationsRef, 
        where('employeeId', '==', employeeId), 
        where('year', '==', currentYear)
      );
      
      const allocationsSnap = await getDocs(q);
      if (allocationsSnap.empty) {
        showErrorToast("Aucune allocation de congés trouvée pour cet employé");
        return false;
      }
      
      const allocationDoc = allocationsSnap.docs[0];
      const allocationData = allocationDoc.data() as LeaveAllocation;
      
      // 3. Vérifier si l'employé a assez de congés disponibles
      let hasEnoughLeaves = true;
      let errorMessage = "";
      
      // Calculer combien de jours vont être utilisés
      const paidDays = type === 'paid' ? (daysRequested || paidDaysUsed) : 0;
      const rttDays = type === 'rtt' ? (daysRequested || rttDaysUsed) : 0;
      
      if (type === 'paid' && allocationData.paidLeavesUsed + paidDays > allocationData.paidLeavesTotal) {
        hasEnoughLeaves = false;
        errorMessage = "Solde de congés payés insuffisant";
      } else if (type === 'rtt' && allocationData.rttUsed + rttDays > allocationData.rttTotal) {
        hasEnoughLeaves = false;
        errorMessage = "Solde de RTT insuffisant";
      }
      
      if (!hasEnoughLeaves) {
        showErrorToast(errorMessage);
        return false;
      }
      
      // 4. Approuver la demande de congé
      await updateLeave(leaveId, { status: 'approved' });
      
      // 5. Mettre à jour l'allocation de congés
      const updatedAllocation = {
        paidLeavesUsed: allocationData.paidLeavesUsed + paidDays,
        rttUsed: allocationData.rttUsed + rttDays,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'hr_leave_allocations', allocationDoc.id), updatedAllocation);
      
      showSuccessToast("Demande approuvée et soldes mis à jour");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'approbation de la demande:", error);
      showErrorToast("Impossible d'approuver la demande");
      return false;
    }
  }, [updateLeave]);

  const rejectLeave = useCallback(async (leaveId: string) => {
    try {
      await updateLeave(leaveId, { status: 'rejected' });
      showErrorToast("Demande refusée");
      return true;
    } catch (error) {
      console.error("Erreur lors du refus de la demande:", error);
      showErrorToast("Impossible de refuser la demande");
      return false;
    }
  }, [updateLeave]);

  return {
    approveLeave,
    rejectLeave
  };
};
