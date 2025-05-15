
// Re-export from the new modular structure
import { generateEmployeePdf, PdfOptions } from './pdf';
import { PdfTab } from './pdf/types';
import { Employee } from '@/types/employee';
import { Document, Leave } from '@/lib/constants';
import { Evaluation } from '@/hooks/useEmployeeEvaluations';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Récupère les documents liés à un employé
 */
const fetchEmployeeDocuments = async (employeeId: string): Promise<Document[]> => {
  try {
    const q = query(
      collection(db, 'hr_documents'),
      where('employeeId', '==', employeeId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Document));
  } catch (error) {
    console.error('Error fetching employee documents:', error);
    return [];
  }
};

/**
 * Récupère les congés liés à un employé
 */
const fetchEmployeeLeaves = async (employeeId: string): Promise<Leave[]> => {
  try {
    const q = query(
      collection(db, 'hr_leaves'),
      where('employeeId', '==', employeeId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Leave));
  } catch (error) {
    console.error('Error fetching employee leaves:', error);
    return [];
  }
};

/**
 * Récupère les évaluations liées à un employé
 */
const fetchEmployeeEvaluations = async (employeeId: string): Promise<Evaluation[]> => {
  try {
    const q = query(
      collection(db, 'hr_evaluations'),
      where('employeeId', '==', employeeId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Evaluation));
  } catch (error) {
    console.error('Error fetching employee evaluations:', error);
    return [];
  }
};

/**
 * Génère un PDF pour l'employé avec ses documents si nécessaire
 */
export const generateEmployeePdfWithDocuments = async (employee: Employee, activeTab: string) => {
  const options: PdfOptions = {};
  
  // Si on est sur l'onglet documents, récupérer les documents
  if (activeTab === 'documents') {
    const documents = await fetchEmployeeDocuments(employee.id);
    options.documents = documents;
  }
  
  // Si on est sur l'onglet congés, récupérer les congés
  if (activeTab === 'conges') {
    const leaves = await fetchEmployeeLeaves(employee.id);
    options.leaves = leaves;
  }
  
  // Si on est sur l'onglet évaluations, récupérer les évaluations
  if (activeTab === 'evaluations') {
    const evaluations = await fetchEmployeeEvaluations(employee.id);
    options.evaluations = evaluations;
  }
  
  // Générer le PDF avec les options appropriées
  generateEmployeePdf(employee, activeTab, options);
};
