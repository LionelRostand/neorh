
// Re-export from the new modular structure
import { generateEmployeePdf } from './pdf';
import { PdfTab } from './pdf/types';
import { Employee } from '@/types/employee';
import { Document } from '@/lib/constants';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Fonction pour récupérer les documents d'un employé
const getEmployeeDocuments = async (employeeId: string): Promise<Document[]> => {
  try {
    const q = query(
      collection(db, 'hr_documents'),
      where('employeeId', '==', employeeId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Document));
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    return [];
  }
};

// Fonction étendue pour générer le PDF d'un employé avec ses documents
export const generateEmployeePdfWithDocuments = async (
  employee: Employee, 
  activeTab: string
): Promise<void> => {
  // Si l'onglet est "documents", récupérer les documents de l'employé
  let documents: Document[] | undefined;
  
  if (activeTab === 'documents' && employee.id) {
    documents = await getEmployeeDocuments(employee.id);
  }
  
  // Générer le PDF avec ou sans documents
  return generateEmployeePdf(employee, activeTab as PdfTab, { documents });
};

export { generateEmployeePdf };
