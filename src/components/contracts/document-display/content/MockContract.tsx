
import React, { useState } from "react";
import DocumentPagination from "../pagination/DocumentPagination";
import MockContractPage from "./MockContractPage";

const MockContract: React.FC = () => {
  // Augmentation du nombre total de pages à 3
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // Nombre total de pages du contrat

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <MockContractPage page={currentPage} />
      </div>
      
      <DocumentPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MockContract;
