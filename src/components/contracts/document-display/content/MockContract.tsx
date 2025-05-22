
import React, { useState } from "react";
import DocumentPagination from "../pagination/DocumentPagination";
import MockContractPage from "./MockContractPage";

const MockContract: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2; // Par défaut, nous supposons qu'il y a 2 pages comme dans l'exemple

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
      />
    </div>
  );
};

export default MockContract;
