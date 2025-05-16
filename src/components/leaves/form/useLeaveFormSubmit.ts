
import { useState } from "react";
import { useCollection } from "@/hooks/useCollection";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { LeaveFormValues } from "./types";
import { doc, getDoc, updateDoc, addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { LeaveAllocation } from "@/hooks/leaves";

export const useLeaveFormSubmit = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { add: addLeave } = useCollection<'hr_leaves'>();
  const { add: addAllocation } = useCollection<'hr_leave_allocations'>();
  const { user } = useAuth();

  const handleSubmit = async (data: LeaveFormValues) => {
    if (!data.startDate || !data.endDate || !data.employeeId) {
      showErrorToast("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      // Récupérer les informations de l'employé pour obtenir son managerId
      let managerId = undefined;
      let employee = null;

      if (data.employeeId) {
        try {
          const employeeRef = doc(db, 'hr_employees', data.employeeId);
          const employeeSnap = await getDoc(employeeRef);
          
          if (employeeSnap.exists()) {
            employee = employeeSnap.data();
            managerId = employee.managerId;
          }
        } catch (err) {
          console.error("Erreur lors de la récupération des données de l'employé:", err);
        }
      }
      
      // Calculer le nombre de jours entre startDate et endDate
      const diffTime = Math.abs(data.endDate.getTime() - data.startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure le jour de début
      
      // Formater les dates en string pour Firestore
      const startDateStr = data.startDate.toISOString().split('T')[0];
      const endDateStr = data.endDate.toISOString().split('T')[0];

      // C'est une attribution de congés sur période
      const currentYear = new Date().getFullYear();
      
      try {
        // Créer une entrée dans hr_leaves pour enregistrer l'allocation
        await addLeave({
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
        
        // Rechercher l'allocation existante pour l'employé
        const allocationRef = collection(db, 'hr_leave_allocations');
        const q = query(allocationRef, where('employeeId', '==', data.employeeId), where('year', '==', currentYear));
        const querySnapshot = await getDocs(q);
        
        let existingAllocation = null;
        if (!querySnapshot.empty) {
          existingAllocation = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
        }
        
        // Toujours stocker les deux valeurs dans l'allocation
        const allocationData: Partial<LeaveAllocation> = {
          employeeId: data.employeeId,
          year: currentYear,
          paidLeavesTotal: data.paidDaysAllocated || (existingAllocation?.paidLeavesTotal || 0),
          rttTotal: data.rttDaysAllocated || (existingAllocation?.rttTotal || 0),
          paidLeavesUsed: existingAllocation?.paidLeavesUsed || 0,
          rttUsed: existingAllocation?.rttUsed || 0,
          updatedAt: new Date().toISOString(),
          // Ne pas inclure updatedBy s'il est undefined
        };

        // Ajouter updatedBy seulement s'il est défini
        if (user?.uid) {
          allocationData.updatedBy = user.uid;
        }
        
        // Créer ou mettre à jour l'allocation
        if (existingAllocation && existingAllocation.id) {
          await updateDoc(doc(db, 'hr_leave_allocations', existingAllocation.id), allocationData);
        } else {
          // Pour une nouvelle allocation, initialiser tous les champs
          const newAllocation: Omit<LeaveAllocation, 'id'> = {
            employeeId: data.employeeId,
            year: currentYear,
            paidLeavesTotal: data.paidDaysAllocated || 0,
            paidLeavesUsed: 0,
            rttTotal: data.rttDaysAllocated || 0,
            rttUsed: 0,
            updatedAt: new Date().toISOString(),
            // Seulement ajouter updatedBy s'il est défini
            ...(user?.uid ? { updatedBy: user.uid } : {})
          };
          await addAllocation(newAllocation);
        }
        
        // Programmer une notification pour le manager lorsque les congés expirent
        if (managerId && data.endDate) {
          const expiryDate = new Date(data.endDate);
          expiryDate.setHours(23, 59, 59, 999);
          
          await addDoc(collection(db, 'hr_notifications'), {
            userId: managerId,
            title: `Expiration des congés de ${employee?.name || 'un employé'}`,
            message: `La période d'attribution de congés se termine le ${endDateStr}.`,
            type: 'leave_expiry',
            status: 'pending',
            createdAt: new Date().toISOString(),
            scheduledFor: expiryDate.toISOString(),
            employeeId: data.employeeId
          });
          
          // Pour les congés payés, gérer la règle des 5 jours reportés
          if (data.paidDaysAllocated && data.paidDaysAllocated > 5) {
            const carryOverDays = 5;
            const nextPeriodNotif = {
              userId: managerId,
              title: `Report de congés de ${employee?.name || 'un employé'}`,
              message: `${carryOverDays} jours de congés payés ont été reportés pour la prochaine période.`,
              type: 'leave_carryover',
              status: 'pending',
              createdAt: new Date().toISOString(),
              scheduledFor: expiryDate.toISOString(),
              employeeId: data.employeeId,
              leaveType: 'paid',
              daysCarriedOver: carryOverDays
            };
            await addDoc(collection(db, 'hr_notifications'), nextPeriodNotif);
          }
        }
        
        showSuccessToast(`Attribution de congés effectuée avec succès`);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'allocation:", error);
        throw error;
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la création de la demande de congés:", error);
      showErrorToast("Impossible de créer l'attribution de congés");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
