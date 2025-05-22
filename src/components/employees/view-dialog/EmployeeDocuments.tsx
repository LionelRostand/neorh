
import React from 'react';
import { Employee } from '@/types/employee';
import { useEmployeeDocuments } from '@/hooks/useEmployeeDocuments';
import DocumentsHeader from './document-components/DocumentsHeader';
import DocumentsLoadingSkeleton from './document-components/DocumentsLoadingSkeleton';
import EmptyDocumentsState from './document-components/EmptyDocumentsState';
import DocumentsGrid from './document-components/DocumentsGrid';

interface EmployeeDocumentsProps {
  employee: Employee;
  onRefresh?: () => void;
}

const EmployeeDocuments: React.FC<EmployeeDocumentsProps> = ({ employee, onRefresh }) => {
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

  // Render content based on state
  const renderContent = () => {
    if (loading) {
      return <DocumentsLoadingSkeleton />;
    }

    if (documents.length === 0) {
      return <EmptyDocumentsState />;
    }

    return <DocumentsGrid documents={documents} onRefresh={refreshDocuments} />;
  };

  return (
    <div className="space-y-4">
      <DocumentsHeader />
      {renderContent()}
    </div>
  );
};

export default EmployeeDocuments;
