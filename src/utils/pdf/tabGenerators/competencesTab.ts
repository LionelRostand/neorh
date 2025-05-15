
import jsPDF from 'jspdf';
import { Employee } from '@/types/employee';
import { Skill } from '@/types/skill';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Génère la section compétences
 */
export const generateCompetencesTab = async (doc: jsPDF, startY: number, employee: Employee) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Compétences', 14, startY);

  // Récupérer les compétences de l'employé depuis Firestore
  const skills: Skill[] = [];
  try {
    const skillsQuery = query(
      collection(db, 'hr_skills'),
      where('employeeId', '==', employee.id)
    );
    const skillsSnapshot = await getDocs(skillsQuery);
    skillsSnapshot.forEach((doc) => {
      skills.push({ id: doc.id, ...(doc.data() as Omit<Skill, 'id'>) });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
  }

  // Si aucune compétence n'est trouvée
  if (skills.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Aucune compétence enregistrée pour cet employé.', 14, startY + 15);
    return startY + 25; // Retourne la nouvelle position Y
  }

  // Organiser les compétences par catégorie
  const categorizedSkills: { [key: string]: Skill[] } = {};
  skills.forEach((skill) => {
    const category = skill.category || 'Non classé';
    if (!categorizedSkills[category]) {
      categorizedSkills[category] = [];
    }
    categorizedSkills[category].push(skill);
  });

  let yPos = startY + 15;

  // Dessiner les compétences par catégorie
  Object.entries(categorizedSkills).forEach(([category, categorySkills], index) => {
    // Ajouter un saut de page si nécessaire
    if (yPos > doc.internal.pageSize.height - 40 && index > 0) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(category, 14, yPos);
    yPos += 10;

    categorySkills.forEach((skill) => {
      // Ajouter un saut de page si nécessaire
      if (yPos > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(skill.name, 14, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(`Niveau: ${skill.level}/5`, 14, yPos + 5);

      // Dessiner la barre de niveau
      const barWidth = 40;
      const filledWidth = (skill.level / 5) * barWidth;
      doc.setDrawColor('#000000');
      doc.setFillColor('#e5e7eb'); // Couleur grise pour le fond
      doc.roundedRect(14, yPos + 7, barWidth, 3, 0.5, 0.5, 'F');
      doc.setFillColor('#3b82f6'); // Couleur bleue pour la partie remplie
      doc.roundedRect(14, yPos + 7, filledWidth, 3, 0.5, 0.5, 'F');

      if (skill.description) {
        doc.setFontSize(8);
        const descLines = doc.splitTextToSize(skill.description, 180);
        doc.text(descLines, 14, yPos + 15);
        yPos += 15 + (descLines.length * 3);
      } else {
        yPos += 15;
      }
    });

    yPos += 5; // Espacement entre les catégories
  });

  return yPos; // Retourne la nouvelle position Y
};
