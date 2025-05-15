
import React from "react";
import { File, MoreHorizontal, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Document } from "@/lib/constants";

interface DocumentCardProps {
  document: Document;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  return (
    <Card className="overflow-hidden border">
      <div className="p-4 flex flex-col">
        <div className="flex justify-center items-center mb-4">
          <File size={40} className="text-gray-400" />
        </div>
        <h3 className="font-medium text-center mb-1">{document.title}</h3>
        <div className="text-center text-gray-500 text-sm">
          {document.fileType === "application/pdf" ? (
            <span className="inline-block bg-gray-100 px-2 py-1 rounded">APPLICATION/PDF</span>
          ) : (
            <span className="inline-block bg-gray-100 px-2 py-1 rounded">UNKNOWN</span>
          )}
        </div>
      </div>
      <div className="border-t flex justify-between items-center py-2 px-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Calendar size={18} />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </Card>
  );
};

export default DocumentCard;
