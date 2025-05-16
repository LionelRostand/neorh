
import { useState } from "react";
import { useCollection } from "@/hooks/useCollection";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { LeaveFormValues } from "@/components/leaves/form/types";
import { doc, getDoc, updateDoc, addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { LeaveAllocation } from "@/hooks/leaves";
import { useFirestore } from "@/hooks/firestore";

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

      if (data.isAllocation) {
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
          
          // Préparer les données d'allocation pour la collection hr_leave_allocations
          const allocationData: Omit<LeaveAllocation, 'id'> = {
            employeeId: data.employeeId,
            year: currentYear,
            paidLeavesTotal: data.paidDaysAllocated || (existingAllocation?.paidLeavesTotal || 0),
            paidLeavesUsed: existingAllocation?.paidLeavesUsed || 0,
            rttTotal: data.rttDaysAllocated || (existingAllocation?.rttTotal || 0),
            rttUsed: existingAllocation?.rttUsed || 0,
            updatedAt: new Date().toISOString(),
            // Ajouter updatedBy seulement s'il est défini
            ...(user?.uid ? { updatedBy: user.uid } : {})
          };
          
          // Créer ou mettre à jour l'allocation
          if (existingAllocation && existingAllocation.id) {
            await updateDoc(doc(db, 'hr_leave_allocations', existingAllocation.id), allocationData);
          } else {
            // Pour une nouvelle allocation, créer l'entrée dans hr_leave_allocations
            await addAllocation(allocationData);
          }
          
          // Programmer une notification pour le manager lorsque les congés expirent
          if (managerId && data.endDate) {
            const expiryDate = new Date(data.endDate);
            expiryDate.setHours(23, 59, 59, 999);
            
            // Notification générale d'expiration
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
      } else {
        // C'est une demande de congé classique
        const leaveType = data.type || 'paid';
        
        // Rechercher l'allocation existante pour l'employé
        const currentYear = new Date().getFullYear();
        const allocationRef = collection(db, 'hr_leave_allocations');
        const q = query(allocationRef, where('employeeId', '==', data.employeeId), where('year', '==', currentYear));
        const querySnapshot = await getDocs(q);
        
        let existingAllocation = null;
        if (!querySnapshot.empty) {
          existingAllocation = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
        }

        // Vérifier s'il y a assez de congés disponibles
        if (existingAllocation) {
          let hasEnoughLeaves = true;
          let errorMessage = "";
          
          if (leaveType === 'paid' && existingAllocation.paidLeavesUsed + diffDays > existingAllocation.paidLeavesTotal) {
            hasEnoughLeaves = false;
            errorMessage = `Solde de congés payés insuffisant. Il vous reste ${existingAllocation.paidLeavesTotal - existingAllocation.paidLeavesUsed} jours, vous demandez ${diffDays} jours.`;
          } else if (leaveType === 'rtt' && existingAllocation.rttUsed + diffDays > existingAllocation.rttTotal) {
            hasEnoughLeaves = false;
            errorMessage = `Solde de RTT insuffisant. Il vous reste ${existingAllocation.rttTotal - existingAllocation.rttUsed} jours, vous demandez ${diffDays} jours.`;
          }
          
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
        const leaveData = {
          employeeId: data.employeeId,
          type: leaveType,
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
        
        await addLeave(leaveData);

        // Notifier le manager de la nouvelle demande
        if (managerId) {
          await addDoc(collection(db, 'hr_notifications'), {
            userId: managerId,
            title: `Nouvelle demande de congé`,
            message: `${employee?.name || 'Un employé'} a soumis une demande de congé`,
            type: 'leave_request',
            status: 'unread',
            createdAt: new Date().toISOString(),
            employeeId: data.employeeId
          });
        }
        
        showSuccessToast(`Demande de congé soumise avec succès`);
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

  return { handleSubmit, isSubmitting };
};
