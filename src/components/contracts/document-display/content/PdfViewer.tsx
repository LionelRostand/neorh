
import React from "react";
import { isBase64Data } from "@/utils/contracts/documentDownload";

interface PdfViewerProps {
  fileUrl: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileUrl }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        {isBase64Data(fileUrl) ? (
          <iframe 
            src={fileUrl}
            className="w-full h-full border rounded-md"
            title="Contract PDF"
          />
        ) : (
          <object 
            data={fileUrl}
            type="application/pdf" 
            className="w-full h-full border rounded-md"
          >
            <p>Le navigateur ne peut pas afficher ce PDF. <a href={fileUrl} target="_blank" rel="noopener noreferrer">Ouvrir le PDF</a></p>
          </object>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
