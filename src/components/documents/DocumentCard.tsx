
import React from "react";
import { Document } from "@/lib/constants";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DocumentCardProps {
  document: Document;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'contracts': return 'Contrat';
      case 'paystubs': return 'Bulletin de paie';
      case 'certificates': return 'Certificat';
      default: return 'Autre';
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'contracts': return 'bg-blue-100 text-blue-800';
      case 'paystubs': return 'bg-green-100 text-green-800';
      case 'certificates': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return 'Date inconnue';
    }
  };

  const handleDownload = () => {
    // Dans une implémentation réelle, ceci téléchargerait le fichier
    console.log("Télécharger le document:", document.fileUrl);
    // Vous pourriez appeler une fonction comme window.open(document.fileUrl) ici
  };

  const handleView = () => {
    // Dans une implémentation réelle, ceci ouvrirait le document dans un visualiseur
    console.log("Visualiser le document:", document.fileUrl);
    // Vous pourriez ouvrir un dialogue ou une nouvelle fenêtre ici
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-gray-100 rounded">
            <FileText className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium line-clamp-1">{document.title}</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              <Badge variant="outline" className={getCategoryColor(document.category)}>
                {getCategoryLabel(document.category)}
              </Badge>
              {document.employeeName && (
                <Badge variant="outline" className="bg-gray-50">
                  {document.employeeName}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {formatDate(document.uploadDate)}
            </p>
            {document.description && (
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                {document.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-2 border-t flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={handleView}>
          <Eye className="h-4 w-4 mr-1" />
          Voir
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          Télécharger
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
