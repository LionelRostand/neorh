
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Service pour gérer les notifications liées aux congés
 */
export const notificationService = {
  /**
   * Envoyer une notification au manager pour une nouvelle demande de congé
   */
  sendNewLeaveRequestNotification: async (
    managerId: string,
    employeeName: string | undefined,
    employeeId: string
  ) => {
    if (!managerId) return;
    
    await addDoc(collection(db, 'hr_notifications'), {
      userId: managerId,
      title: `Nouvelle demande de congé`,
      message: `${employeeName || 'Un employé'} a soumis une demande de congé`,
      type: 'leave_request',
      status: 'unread',
      createdAt: new Date().toISOString(),
      employeeId: employeeId
    });
  },

  /**
   * Planifier les notifications d'expiration de congés
   */
  scheduleLeaveExpirationNotifications: async (
    managerId: string, 
    employeeName: string | undefined, 
    employeeId: string, 
    endDateStr: string,
    expiryDate: Date
  ) => {
    if (!managerId) return;
    
    // Notification générale d'expiration
    await addDoc(collection(db, 'hr_notifications'), {
      userId: managerId,
      title: `Expiration des congés de ${employeeName || 'un employé'}`,
      message: `La période d'attribution de congés se termine le ${endDateStr}.`,
      type: 'leave_expiry',
      status: 'pending',
      createdAt: new Date().toISOString(),
      scheduledFor: expiryDate.toISOString(),
      employeeId: employeeId
    });
  },
  
  /**
   * Planifier une notification de report des jours de congés
   */
  scheduleCarryOverNotification: async (
    managerId: string, 
    employeeName: string | undefined, 
    employeeId: string, 
    expiryDate: Date,
    carryOverDays: number
  ) => {
    if (!managerId) return;
    
    const nextPeriodNotif = {
      userId: managerId,
      title: `Report de congés de ${employeeName || 'un employé'}`,
      message: `${carryOverDays} jours de congés payés ont été reportés pour la prochaine période.`,
      type: 'leave_carryover',
      status: 'pending',
      createdAt: new Date().toISOString(),
      scheduledFor: expiryDate.toISOString(),
      employeeId: employeeId,
      leaveType: 'paid',
      daysCarriedOver: carryOverDays
    };
    
    await addDoc(collection(db, 'hr_notifications'), nextPeriodNotif);
  }
};
