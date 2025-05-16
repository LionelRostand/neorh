
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type NotificationType = 
  | 'leave_request' 
  | 'leave_approval' 
  | 'leave_rejection' 
  | 'leave_expiry'
  | 'leave_carryover';

export interface Notification {
  userId: string; // ID de l'utilisateur qui recevra la notification
  title: string;
  message: string;
  type: NotificationType;
  status: 'pending' | 'read' | 'dismissed';
  createdAt: string;
  scheduledFor?: string; // Date prévue pour afficher la notification
  employeeId?: string;
  leaveType?: string;
  daysCarriedOver?: number;
}

export const createNotification = async (notification: Notification): Promise<string | null> => {
  try {
    const notificationRef = await addDoc(collection(db, 'hr_notifications'), notification);
    return notificationRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    return null;
  }
};

export const scheduleLeaveExpiryNotification = async (
  managerId: string,
  employeeId: string,
  employeeName: string,
  leaveType: string,
  expiryDate: Date,
  daysRemaining?: number
): Promise<string | null> => {
  const notification: Notification = {
    userId: managerId,
    title: `Expiration des congés de ${employeeName}`,
    message: `Les congés ${leaveType === 'paid' ? 'payés' : 'RTT'} se terminent le ${expiryDate.toLocaleDateString()}. ${
      daysRemaining && daysRemaining > 5 && leaveType === 'paid'
        ? `5 jours de congés seront reportés sur la prochaine période.`
        : ''
    }`,
    type: 'leave_expiry',
    status: 'pending',
    createdAt: new Date().toISOString(),
    scheduledFor: expiryDate.toISOString(),
    employeeId,
    leaveType
  };

  return createNotification(notification);
};
