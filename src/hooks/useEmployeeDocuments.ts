
import { useState, useEffect, useRef } from 'react';
import { Document } from '@/lib/constants';
import { Employee } from '@/types/employee';
import useFirestore from '@/hooks/useFirestore';
import { toast } from '@/components/ui/use-toast';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { HR } from '@/lib/constants/collections';

export const useEmployeeDocuments = (employee: Employee) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const documentsCollection = useFirestore<Document>("hr_documents");
  
  // References to avoid multiple calls
  const fetchInProgress = useRef(false);
  const lastFetchedEmployeeId = useRef<string | null>(null);

  // Helper function to remove duplicates based on title and period
  const removeDuplicates = (docs: Document[]): Document[] => {
    const seen = new Set<string>();
    return docs.filter(doc => {
      // Create a unique key based on title and category
      const key = `${doc.title}-${doc.category}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  const fetchEmployeeDocuments = async () => {
    if (!employee?.id) return;
    
    // Check if a request is already in progress for the same employee
    if (fetchInProgress.current) {
      console.log("Employee document request already in progress, cancelling duplicate");
      return;
    }
    
    // If documents have already been loaded for this employee, don't reload
    if (lastFetchedEmployeeId.current === employee.id && documents.length > 0 && !loading) {
      console.log("Documents already loaded for this employee");
      return;
    }
    
    try {
      fetchInProgress.current = true;
      setLoading(true);
      setFetchCompleted(false);
      
      console.log(`Fetching documents for employee: ${employee.id}`);
      
      // Two ways to retrieve documents: 
      // 1. With useFirestore
      const result = await documentsCollection.search({
        field: "employeeId",
        operator: "==", 
        value: employee.id
      });
      
      let fetchedDocs: Document[] = [];
      
      if (result.docs) {
        fetchedDocs = result.docs.map(doc => ({
          id: doc.id || '',
          title: doc.title || 'Document sans nom',
          category: doc.category || 'other',
          fileUrl: doc.fileUrl || '',
          fileType: doc.fileType || 'application/pdf',
          uploadDate: doc.uploadDate || new Date().toISOString(),
          status: doc.status || 'active',
          employeeId: doc.employeeId,
          employeeName: doc.employeeName,
          contractId: doc.contractId,
          description: doc.description,
          signedByEmployee: doc.signedByEmployee || false,
          signedByEmployer: doc.signedByEmployer || false
        }));
      }
      
      // 2. Directly retrieve the employee's payslips - REMOVED orderBy to fix index error
      const payslipsQuery = query(
        collection(db, HR.PAYSLIPS),
        where("employeeId", "==", employee.id)
      );
      
      const payslipsSnapshot = await getDocs(payslipsQuery);
      const payslipsDocs: Document[] = [];
      
      payslipsSnapshot.forEach((doc) => {
        const data = doc.data();
        payslipsDocs.push({
          id: doc.id,
          title: `Fiche de paie - ${data.period || 'Période non spécifiée'}`,
          category: 'paystubs',
          fileUrl: data.fileUrl || '',
          fileType: 'application/pdf',
          uploadDate: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          status: 'active',
          employeeId: data.employeeId,
          employeeName: data.employeeName || employee.name,
          description: `Fiche de paie pour la période ${data.period || 'non spécifiée'}`
        });
      });
      
      // Combine results, remove duplicates, and sort manually by upload date (most recent first)
      const allDocs = removeDuplicates([...fetchedDocs, ...payslipsDocs]).sort((a, b) => {
        const dateA = new Date(a.uploadDate || 0).getTime();
        const dateB = new Date(b.uploadDate || 0).getTime();
        return dateB - dateA; // Most recent first
      });
      
      console.log(`Found ${allDocs.length} unique documents for employee ${employee.id}, including ${payslipsDocs.length} payslips`);
      setDocuments(allDocs);
      lastFetchedEmployeeId.current = employee.id;
      
    } catch (error) {
      console.error('Error fetching employee documents:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les documents de l'employé",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setFetchCompleted(true);
      fetchInProgress.current = false;
    }
  };

  useEffect(() => {
    // Only load documents if employee ID changes
    if (employee.id && lastFetchedEmployeeId.current !== employee.id) {
      fetchEmployeeDocuments();
    }
  }, [employee.id]);

  const handleRefresh = () => {
    lastFetchedEmployeeId.current = null; // Reset ID to force reload
    fetchEmployeeDocuments();
  };

  return {
    documents,
    loading,
    fetchCompleted,
    handleRefresh
  };
};
