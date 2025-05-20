
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

  useEffect(() => {
    const fetchEmployeeDocuments = async () => {
      if (!employee?.id || fetchCompleted) return;
      
      setLoading(true);
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
            description: doc.description
          }));
          
          console.log(`Found ${fetchedDocs.length} documents for employee ${employee.id}`);
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

    fetchEmployeeDocuments();
  }, [employee.id, documentsCollection, fetchCompleted]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-semibold">Documents</h3>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Ajouter un document
        </Button>
      </div>
      
      <DocumentList documents={documents} loading={loading} />
    </div>
  );
};

export default EmployeeDocuments;
