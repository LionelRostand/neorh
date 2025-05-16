
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
    if (!data.startDate || !data.endDate || !data.employeeId || !data.type) {
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

      // Vérifier si c'est une allocation ou une demande de congé normale
      if (data.isAllocation) {
        // C'est une attribution de congés
        
        // Définir l'année courante
        const currentYear = new Date().getFullYear();
        
        try {
          // Créer une entrée dans hr_leaves pour enregistrer l'allocation
          await addLeave({
            employeeId: data.employeeId,
            type: data.type,
            startDate: startDateStr,
            endDate: endDateStr,
            status: 'approved', // Les allocations sont approuvées par défaut
            comment: data.comment || '',
            managerId,
            createdAt: new Date().toISOString(),
            paidDaysAllocated: data.paidDaysAllocated || 0,
            rttDaysAllocated: data.rttDaysAllocated || 0,
            daysAllocated: (data.type === 'paid' ? data.paidDaysAllocated : data.rttDaysAllocated) || 0,
            isAllocation: true
          });
          
          // Rechercher l'allocation existante pour l'employé
          const allocationRef = collection(db, 'hr_leave_allocations');
          const allocationQuery = query(allocationRef, where('employeeId', '==', data.employeeId), where('year', '==', currentYear));
          const allocationSnapshot = await getDocs(allocationQuery);
          
          let existingAllocation = null;
          if (!allocationSnapshot.empty) {
            existingAllocation = { id: allocationSnapshot.docs[0].id, ...allocationSnapshot.docs[0].data() };
          }
          
          // Always store both values in the allocation, regardless of leave type
          const allocationData: Partial<LeaveAllocation> = {
            employeeId: data.employeeId,
            year: currentYear,
            paidLeavesTotal: data.paidDaysAllocated || (existingAllocation?.paidLeavesTotal || 0),
            rttTotal: data.rttDaysAllocated || (existingAllocation?.rttTotal || 0),
            paidLeavesUsed: existingAllocation?.paidLeavesUsed || 0,
            rttUsed: existingAllocation?.rttUsed || 0,
            updatedAt: new Date().toISOString(),
            updatedBy: user?.uid
          };
          
          // Créer ou mettre à jour l'allocation
          if (existingAllocation) {
            await updateDoc(doc(db, 'hr_leave_allocations', existingAllocation.id), allocationData);
          } else {
            // Pour une nouvelle allocation, initialiser tous les champs
            const newAllocation: LeaveAllocation = {
              employeeId: data.employeeId,
              year: currentYear,
              paidLeavesTotal: data.paidDaysAllocated || 0,
              paidLeavesUsed: 0,
              rttTotal: data.rttDaysAllocated || 0,
              rttUsed: 0,
              updatedAt: new Date().toISOString(),
              updatedBy: user?.uid
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
              message: `Les congés ${data.type === 'paid' ? 'payés' : 'RTT'} se terminent le ${endDateStr}. Vérifiez le statut.`,
              type: 'leave_expiry',
              status: 'pending',
              createdAt: new Date().toISOString(),
              scheduledFor: expiryDate.toISOString(),
              employeeId: data.employeeId,
              leaveType: data.type
            });
            
            // Pour les congés payés, gérer la règle des 5 jours reportés
            if (data.paidDaysAllocated && data.paidDaysAllocated > 5) {
              const nextPeriodNotif = {
                userId: managerId,
                title: `Report de congés de ${employee?.name || 'un employé'}`,
                message: `5 jours de congés payés ont été reportés pour la prochaine période.`,
                type: 'leave_carryover',
                status: 'pending',
                createdAt: new Date().toISOString(),
                scheduledFor: expiryDate.toISOString(),
                employeeId: data.employeeId,
                leaveType: data.type,
                daysCarriedOver: 5
              };
              await addDoc(collection(db, 'hr_notifications'), nextPeriodNotif);
            }
          }
          
          showSuccessToast(`Attribution de congés effectuée avec succès`);
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'allocation:", error);
          throw error;
        }
      } else {
        // C'est une demande de congé normale
        await addLeave({
          employeeId: data.employeeId,
          type: data.type,
          startDate: startDateStr,
          endDate: endDateStr,
          status: 'pending', // Par défaut, toujours en attente
          comment: data.comment || '',
          managerId,
          createdAt: new Date().toISOString(),
          daysAllocated: data.daysAllocated || diffDays // Utiliser les jours alloués ou calculer
        });
        
        showSuccessToast("Demande de congés créée avec succès");
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la création de la demande de congés:", error);
      showErrorToast("Impossible de créer la demande de congés");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
