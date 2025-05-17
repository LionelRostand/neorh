
import JsPDF from 'jspdf';
import { Employee } from '@/types/employee';
import {
  generateInformationsTab,
  generateDocumentsTab,
  generateCompetencesTab,
  generateHorairesTab,
  generateCongesTab,
  generateFeuillesDeTempsTab,
  generateEvaluationsTab
} from './pdf/tabGenerators';

export const generateEmployeePdfWithDocuments = async (employee: Employee, activeTab: string) => {
  const doc = new JsPDF();

  switch (activeTab) {
    case 'informations':
      generateInformationsTab(doc, employee);
      break;
    case 'documents':
      await generateDocumentsTab(doc, employee);
      break;
    case 'competences':
      generateCompetencesTab(doc, employee);
      break;
    case 'horaires':
      generateHorairesTab(doc, employee);
      break;
    case 'feuillesdetemps':
      generateFeuillesDeTempsTab(doc, employee);
      break;
    case 'conges':
      generateCongesTab(doc, employee);
      break;
    case 'evaluations':
      generateEvaluationsTab(doc, employee);
      break;
    default:
      generateInformationsTab(doc, employee);
  }

  // Sauvegarder le PDF avec le nom de l'employé
  const fileName = `${employee.name}_${activeTab}.pdf`;
  doc.save(fileName);

  return fileName;
};
