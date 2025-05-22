
import React, { useState } from 'react';
import { Employee } from '@/types/employee';
import { useEmployeeDocuments } from '@/hooks/useEmployeeDocuments';
import DocumentsHeader from './document-components/DocumentsHeader';
import DocumentsLoadingSkeleton from './document-components/DocumentsLoadingSkeleton';
import EmptyDocumentsState from './document-components/EmptyDocumentsState';
import DocumentsGrid from './document-components/DocumentsGrid';
import { toast } from '@/components/ui/use-toast';
// À implémenter ultérieurement si nécessaire
// import AddDocumentDialog from './document-components/AddDocumentDialog';

interface EmployeeDocumentsProps {
  employee: Employee;
  onRefresh?: () => void;
}

const EmployeeDocuments: React.FC<EmployeeDocumentsProps> = ({ employee, onRefresh }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { 
    documents, 
    loading, 
    handleRefresh 
  } = useEmployeeDocuments(employee);

  // Handle refresh including callback to parent
  const refreshDocuments = () => {
    handleRefresh();
    if (onRefresh) {
      onRefresh();
    }
  };
  
  // Gérer l'ouverture du dialogue d'ajout de document
  const handleAddDocument = () => {
    // Pour l'instant, afficher un toast car le dialogue n'est pas implémenté
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout de document sera disponible dans une future mise à jour.",
      duration: 3000
    });
    setIsAddDialogOpen(true);
  };

  // Render content based on state
  const renderContent = () => {
    if (loading) {
      return <DocumentsLoadingSkeleton />;
    }

    if (documents.length === 0) {
      return <EmptyDocumentsState onAddDocument={handleAddDocument} />;
    }

    return <DocumentsGrid documents={documents} onRefresh={refreshDocuments} />;
  };

  return (
    <div className="space-y-4">
      <DocumentsHeader onAddDocument={handleAddDocument} />
      {renderContent()}
      
      {/* Pour une future mise à jour
      {isAddDialogOpen && (
        <AddDocumentDialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen} 
          employee={employee}
          onSuccess={refreshDocuments}
        />
      )}
      */}
    </div>
  );
};

export default EmployeeDocuments;
