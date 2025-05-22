
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

interface DocumentPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageChange?: (page: number) => void;
}

const DocumentPagination: React.FC<DocumentPaginationProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onPageChange,
}) => {
  // Générer les éléments de pagination
  const renderPaginationItems = () => {
    const items = [];
    
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => onPageChange && onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t gap-2">
      <div>
        Page {currentPage} sur {totalPages}
      </div>
      
      <div className="flex flex-1 justify-center">
        <Pagination>
          <PaginationContent>
            {renderPaginationItems()}
          </PaginationContent>
        </Pagination>
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
