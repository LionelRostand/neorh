
import { useState } from "react";
import { useCollection } from "@/hooks/useCollection";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { LeaveFormValues } from "@/components/leaves/form/types";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export const useLeaveFormSubmit = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { add: addLeave } = useCollection<'hr_leaves'>();
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
      
      if (data.employeeId) {
        try {
          const employeeRef = doc(db, 'hr_employees', data.employeeId);
          const employeeSnap = await getDoc(employeeRef);
          
          if (employeeSnap.exists()) {
            const employee = employeeSnap.data();
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

      // C'est une demande de congé classique
      const leaveType = data.type || 'paid';
      
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
          message: `Un employé a soumis une demande de congé`,
          type: 'leave_request',
          status: 'unread',
          createdAt: new Date().toISOString(),
          employeeId: data.employeeId
        });
      }
      
      showSuccessToast(`Demande de congé soumise avec succès`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la création de la demande de congés:", error);
      showErrorToast("Impossible de soumettre la demande de congé");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
