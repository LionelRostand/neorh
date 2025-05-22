
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DocumentPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const DocumentPagination: React.FC<DocumentPaginationProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-t">
      <div>
        Page {currentPage} / {totalPages}
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          Suivant <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentPagination;
