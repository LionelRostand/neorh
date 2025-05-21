
import React, { useEffect, useState } from 'react';
import { Document } from '@/lib/constants';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { File, Plus, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DocumentList from '@/components/documents/DocumentList';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import useFirestore from '@/hooks/useFirestore';

interface EmployeeDocumentsProps {
  employee: Employee;
}

const EmployeeDocuments: React.FC<EmployeeDocumentsProps> = ({ employee }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const documentsCollection = useFirestore<Document>("hr_documents");

  const fetchEmployeeDocuments = async () => {
    if (!employee?.id) return;
    
    setLoading(true);
    setFetchCompleted(false);
    
    try {
      console.log(`Fetching documents for employee: ${employee.id}`);
      
      // Utiliser la méthode search pour récupérer les documents de l'employé
      const result = await documentsCollection.search({
        field: "employeeId",
        operator: "==", 
        value: employee.id
      });
      
      if (result.docs) {
        const fetchedDocs = result.docs.map(doc => ({
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
          description: doc.description || '',
          signedByEmployee: doc.signedByEmployee || false,
          signedByEmployer: doc.signedByEmployer || false,
          // These properties were causing TypeScript errors - now they're properly typed
          departmentId: doc.departmentId,
          departmentName: doc.departmentName,
          salary: doc.salary,
          conventionCollective: doc.conventionCollective,
        }));
        
        console.log(`Found ${fetchedDocs.length} documents for employee ${employee.id}`);
        
        // Trier les documents par date (les plus récents en premier)
        fetchedDocs.sort((a, b) => {
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        });
        
        setDocuments(fetchedDocs);
      }
      
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
    }
  };

  useEffect(() => {
    fetchEmployeeDocuments();
  }, [employee.id]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-semibold">Documents</h3>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Ajouter un document
        </Button>
      </div>
      
      <DocumentList 
        documents={documents} 
        loading={loading} 
        onRefresh={fetchEmployeeDocuments}
      />
      
      {!loading && documents.length === 0 && (
        <div className="text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
          <p className="mt-1 text-sm text-gray-500">Aucun document n'a été trouvé pour cet employé.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeDocuments;
