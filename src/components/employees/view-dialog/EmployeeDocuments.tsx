
import React, { useEffect, useState, useRef } from 'react';
import { Document } from '@/lib/constants';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import useFirestore from '@/hooks/useFirestore';
import DocumentCard from '@/components/documents/EmployeeDocumentCard';

interface EmployeeDocumentsProps {
  employee: Employee;
}

const EmployeeDocuments: React.FC<EmployeeDocumentsProps> = ({ employee }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const documentsCollection = useFirestore<Document>("hr_documents");
  
  // Références pour éviter les appels multiples
  const fetchInProgress = useRef(false);
  const lastFetchedEmployeeId = useRef<string | null>(null);

  const fetchEmployeeDocuments = async () => {
    if (!employee?.id) return;
    
    // Vérifier si une requête est déjà en cours pour le même employé
    if (fetchInProgress.current) {
      console.log("Requête de documents employé déjà en cours, annulation du doublon");
      return;
    }
    
    // Si les documents ont déjà été chargés pour cet employé, ne pas recharger
    if (lastFetchedEmployeeId.current === employee.id && documents.length > 0 && !loading) {
      console.log("Documents déjà chargés pour cet employé");
      return;
    }
    
    try {
      fetchInProgress.current = true;
      setLoading(true);
      setFetchCompleted(false);
      
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
          description: doc.description,
          signedByEmployee: doc.signedByEmployee || false,
          signedByEmployer: doc.signedByEmployer || false
        }));
        
        console.log(`Found ${fetchedDocs.length} documents for employee ${employee.id}`);
        setDocuments(fetchedDocs);
        lastFetchedEmployeeId.current = employee.id;
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
      fetchInProgress.current = false;
    }
  };

  useEffect(() => {
    // Ne charger les documents que si l'ID de l'employé change
    if (employee.id && lastFetchedEmployeeId.current !== employee.id) {
      fetchEmployeeDocuments();
    }
  }, [employee.id]);

  // Fonction de rafraîchissement pour être appelée après la suppression d'un document
  const handleRefresh = () => {
    lastFetchedEmployeeId.current = null; // Réinitialiser l'ID pour forcer le rechargement
    fetchEmployeeDocuments();
  };

  // Rendu du contenu selon l'état
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((_, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between mt-4 pt-4 border-t">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="text-center py-10 border rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun document</h3>
          <p className="mt-1 text-sm text-gray-500">
            Cet employé n'a aucun document associé.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onRefresh={handleRefresh}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Documents</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 bg-white border-emerald-600 text-emerald-600 hover:bg-emerald-50"
        >
          <Plus className="h-4 w-4" />
          Ajouter un document
        </Button>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default EmployeeDocuments;
