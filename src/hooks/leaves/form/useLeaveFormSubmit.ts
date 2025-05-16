
import { useState } from "react";
import { useCollection } from "@/hooks/useCollection";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { LeaveFormValues } from "@/components/leaves/form/types";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { LeaveAllocation } from "@/hooks/leaves";
import { useFirestore } from "@/hooks/firestore";
import { employeeService } from "./utils/employeeService";
import { notificationService } from "./utils/notificationService";
import { allocationService } from "./utils/allocationService";
import { leaveRequestService } from "./utils/leaveRequestService";

export const useLeaveFormSubmit = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { add: addLeave } = useCollection<'hr_leaves'>();
  const { add: addAllocation } = useFirestore<LeaveAllocation>('hr_leave_allocations');
  const { update: updateAllocation } = useFirestore<LeaveAllocation>('hr_leave_allocations');
  const { user } = useAuth();

  const handleSubmit = async (data: LeaveFormValues) => {
    if (!data.startDate || !data.endDate || !data.employeeId) {
      showErrorToast("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      // Récupérer les informations de l'employé
      const { employee, managerId } = await employeeService.fetchEmployeeInfo(data.employeeId);
      
      // Calculer le nombre de jours entre startDate et endDate
      const diffTime = Math.abs(data.endDate.getTime() - data.startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure le jour de début
      
      // Formater les dates en string pour Firestore
      const startDateStr = data.startDate.toISOString().split('T')[0];
      const endDateStr = data.endDate.toISOString().split('T')[0];

      if (data.isAllocation) {
        await handleAllocation(data, managerId, employee?.name, startDateStr, endDateStr);
      } else {
        await handleLeaveRequest(data, managerId, employee?.name, diffDays, startDateStr, endDateStr);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la création de la demande de congés:", error);
      showErrorToast(data.isAllocation ? 
        "Impossible de créer l'attribution de congés" : 
        "Impossible de soumettre la demande de congé");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Traiter une allocation de congés
   */
  const handleAllocation = async (
    data: LeaveFormValues, 
    managerId: string | undefined, 
    employeeName: string | undefined, 
    startDateStr: string, 
    endDateStr: string
  ) => {
    const currentYear = new Date().getFullYear();
    
    try {
      // Créer une entrée dans hr_leaves pour l'allocation
      await leaveRequestService.createLeaveAllocation(data, managerId, startDateStr, endDateStr);
      
      // Récupérer l'allocation existante pour l'employé
      const { existingAllocation } = await allocationService.fetchExistingAllocation(
        data.employeeId, 
        currentYear
      );
      
      // Préparer les données d'allocation
      const allocationData = allocationService.prepareAllocationData(
        data, 
        existingAllocation, 
        currentYear, 
        user?.uid
      );
      
      // Créer ou mettre à jour l'allocation
      if (existingAllocation && existingAllocation.id) {
        await updateDoc(doc(db, 'hr_leave_allocations', existingAllocation.id), allocationData);
      } else {
        // Pour une nouvelle allocation, créer l'entrée
        await addAllocation(allocationData);
      }
      
      // Programmer des notifications pour l'expiration des congés
      if (managerId && data.endDate) {
        const expiryDate = new Date(data.endDate);
        expiryDate.setHours(23, 59, 59, 999);
        
        // Notification d'expiration générale
        await notificationService.scheduleLeaveExpirationNotifications(
          managerId,
          employeeName,
          data.employeeId,
          endDateStr,
          expiryDate
        );
        
        // Pour les congés payés, gérer la règle des 5 jours reportés
        if (data.paidDaysAllocated && data.paidDaysAllocated > 5) {
          const carryOverDays = 5;
          await notificationService.scheduleCarryOverNotification(
            managerId,
            employeeName,
            data.employeeId,
            expiryDate,
            carryOverDays
          );
        }
      }
      
      showSuccessToast(`Attribution de congés effectuée avec succès`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'allocation:", error);
      throw error;
    }
  };
  
  /**
   * Traiter une demande de congé
   */
  const handleLeaveRequest = async (
    data: LeaveFormValues, 
    managerId: string | undefined, 
    employeeName: string | undefined,
    diffDays: number,
    startDateStr: string,
    endDateStr: string
  ) => {
    // C'est une demande de congé classique
    const leaveType = data.type || 'paid';
    
    // Récupérer l'allocation existante pour l'employé
    const currentYear = new Date().getFullYear();
    const { existingAllocation } = await allocationService.fetchExistingAllocation(
      data.employeeId, 
      currentYear
    );
    
    // Vérifier s'il y a assez de congés disponibles
    if (existingAllocation) {
      const { hasEnoughLeaves, errorMessage } = allocationService.validateLeaveBalance(
        existingAllocation, 
        leaveType, 
        diffDays
      );
      
      if (!hasEnoughLeaves) {
        showErrorToast(errorMessage);
        setIsSubmitting(false);
        return;
      }
    }
    
    // Calculer les jours utilisés pour chaque type de congé
    const paidDaysUsed = leaveType === 'paid' ? diffDays : 0;
    const rttDaysUsed = leaveType === 'rtt' ? diffDays : 0;
    
    // Créer la demande de congé
    await leaveRequestService.createLeaveRequest(
      data, 
      managerId, 
      paidDaysUsed, 
      rttDaysUsed, 
      diffDays, 
      startDateStr, 
      endDateStr
    );
    
    // Notifier le manager de la nouvelle demande
    if (managerId) {
      await notificationService.sendNewLeaveRequestNotification(
        managerId, 
        employeeName, 
        data.employeeId
      );
    }
    
    showSuccessToast(`Demande de congé soumise avec succès`);
  };

  return { handleSubmit, isSubmitting };
};
