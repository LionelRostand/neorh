
import React, { useEffect, useState } from 'react';
import { Document } from '@/lib/constants';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { File, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DocumentList from '@/components/documents/DocumentList';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/hooks/firestore';
import { toast } from '@/components/ui/use-toast';

interface EmployeeDocumentsProps {
  employee: Employee;
}

const EmployeeDocuments: React.FC<EmployeeDocumentsProps> = ({ employee }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Utiliser le hook useFirestore pour accéder à la fonction de recherche
  const documentsCollection = useFirestore<Document>('hr_documents');

  useEffect(() => {
    const fetchEmployeeDocuments = async () => {
      if (!employee?.id) return;
      
      setLoading(true);
      try {
        console.log(`Fetching documents for employee: ${employee.id}`);
        
        // Utiliser la fonction search pour éviter les problèmes d'opérateur 'in'
        const result = await documentsCollection.search('employeeId', employee.id);
        
        if (result && result.docs) {
          console.log(`Found ${result.docs.length} documents for employee ${employee.id}`);
          setDocuments(result.docs);
        } else {
          console.log('No documents found or invalid result');
          setDocuments([]);
        }
      } catch (error) {
        console.error('Error fetching employee documents:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        setError(error instanceof Error ? error : new Error(errorMessage));
        
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les documents de l'employé",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDocuments();
  }, [employee.id, documentsCollection]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold">Documents</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-semibold">Documents</h3>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Ajouter un document
        </Button>
      </div>
      
      {documents.length > 0 ? (
        <DocumentList documents={documents} />
      ) : (
        <div className="text-center py-10">
          <File className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun document</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun document disponible pour cet employé.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeDocuments;
