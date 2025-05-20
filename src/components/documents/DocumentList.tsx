
import React from "react";
import DocumentCard from "./DocumentCard";
import { Document } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { File } from "lucide-react";

interface DocumentListProps {
  documents: Document[];
  loading?: boolean;
  onRefresh?: () => void;
}

const DocumentList = ({ documents, loading = false, onRefresh }: DocumentListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (documents.length === 0) {
    return (
      <div className="text-center py-10">
        <File className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun document</h3>
        <p className="mt-1 text-sm text-gray-500">
          Aucun document disponible dans cette catégorie.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <DocumentCard 
          key={document.id} 
          document={document}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
};

export default DocumentList;
