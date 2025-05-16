
// Re-export from the new modular structure
import { generateEmployeePdf, PdfOptions } from './pdf';
import { PdfTab } from './pdf/types';
import { Employee } from '@/types/employee';
import { Document, Leave } from '@/lib/constants';
import { Evaluation } from '@/hooks/useEmployeeEvaluations';
import { Company } from '@/types/company';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
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
 * Récupère l'entreprise liée à un employé
 */
const fetchEmployeeCompany = async (departmentId?: string): Promise<Company | null> => {
  if (!departmentId) return null;
  
  try {
    // D'abord, récupérer le département pour avoir l'ID de l'entreprise
    const departmentRef = doc(db, 'hr_departments', departmentId);
    const departmentSnap = await getDoc(departmentRef);
    
    if (!departmentSnap.exists()) return null;
    
    const departmentData = departmentSnap.data();
    const companyId = departmentData?.companyId;
    
    if (!companyId) return null;
    
    // Ensuite, récupérer l'entreprise
    const companyRef = doc(db, 'hr_companies', companyId);
    const companySnap = await getDoc(companyRef);
    
    if (!companySnap.exists()) return null;
    
    return { 
      id: companySnap.id,
      ...companySnap.data()
    } as Company;
  } catch (error) {
    console.error('Error fetching employee company:', error);
    return null;
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
  
  // Récupérer l'entreprise de l'employé
  const company = await fetchEmployeeCompany(employee.departmentId);
  if (company) {
    options.company = company;
  }
  
  // Générer le PDF avec les options appropriées
  generateEmployeePdf(employee, activeTab, options);
};
