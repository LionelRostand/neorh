
import jsPDF from 'jspdf';
import { Employee } from '@/types/employee';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WorkSchedule {
  id?: string;
  employeeId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  isActive: boolean;
}

const daysOfWeek = [
  "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
];

/**
 * Génère la section horaires
 */
export const generateHorairesTab = async (doc: jsPDF, employee: Employee) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Horaires', 14, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  try {
    // Récupérer les horaires de l'employé
    const schedulesQuery = query(
      collection(db, 'hr_work_schedules'),
      where('employeeId', '==', employee.id || '')
    );
    
    const schedulesSnapshot = await getDocs(schedulesQuery);
    const schedules: WorkSchedule[] = [];
    
    schedulesSnapshot.forEach((doc) => {
      schedules.push({ id: doc.id, ...doc.data() } as WorkSchedule);
    });
    
    // Trier les horaires par jour de la semaine
    schedules.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    
    if (schedules.length > 0) {
      // Dessiner un en-tête pour le tableau
      doc.setFillColor(240, 240, 240);
      doc.rect(14, 40, 180, 10, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.text('Jour', 20, 47);
      doc.text('Horaires', 100, 47);
      
      // Dessiner les lignes du tableau
      doc.setFont('helvetica', 'normal');
      
      let y = 60;
      
      schedules.forEach((schedule, index) => {
        doc.text(daysOfWeek[schedule.dayOfWeek], 20, y);
        doc.text(`${schedule.startTime} - ${schedule.endTime}`, 100, y);
        y += 10;
        
        // Ajouter une ligne séparatrice
        if (index < schedules.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.line(14, y - 5, 194, y - 5);
        }
      });
    } else {
      doc.text('Aucun horaire défini pour cet employé.', 14, 45);
    }
  } catch (error) {
    console.error("Erreur lors de la génération du PDF des horaires:", error);
    doc.text('Erreur lors du chargement des horaires.', 14, 45);
  }
};
