
import React, { useState } from "react";
import { Document } from "@/lib/constants";
import { isBase64Data } from "@/utils/contracts/documentDownload";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentViewerProps {
  document: Document | null;
  loading: boolean;
  error: string | null;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, loading, error }) => {
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

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Chargement du contrat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!document?.fileUrl) {
    // Si aucun document n'est disponible, on affiche un exemple de contrat basé sur les captures
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {currentPage === 1 ? (
            <div className="bg-white p-8 min-h-full">
              <div className="mb-8">
                <h3 className="font-bold mb-1">NEOTECH-CONSULTING</h3>
                <p className="text-sm">721 Résidence de l'aquitaine</p>
                <p className="text-sm">77190 DAMMARIE LES LYS</p>
                <p className="text-sm">Tél: +33777334422</p>
                <p className="text-sm">Email: contact@neotech-consulting.com</p>
              </div>
              
              <h1 className="text-center font-bold text-xl my-10">CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE</h1>
              
              <p className="mb-4">Fait à DAMMARIE LES LYS, le 21 mai 2025</p>
              
              <div className="mb-4">
                <p className="font-bold">ENTRE LES SOUSSIGNÉS :</p>
                <p className="mt-2">La société NEOTECH-CONSULTING, propriétaire dans le secteur ESN</p>
                <p>Siège social : 721 Résidence de l'aquitaine, 77190 DAMMARIE LES LYS</p>
                <p>Représentée par son dirigeant légal,</p>
                <p className="font-bold">Ci-après dénommée "L'EMPLOYEUR"</p>
              </div>
              
              <div className="mb-4">
                <p className="font-bold">ET</p>
                <p className="mt-2">Lionel DJOSSA</p>
                <p className="font-bold">Ci-après dénommé(e) "LE SALARIÉ"</p>
              </div>
              
              <p className="font-bold mb-4">IL A ÉTÉ CONVENU CE QUI SUIT :</p>
              
              <div className="mb-4">
                <p className="font-bold text-blue-800">Article 1 - Engagement</p>
                <p>Le salarié est engagé en qualité de PDG au sein du département Direction Générale.</p>
                <p>Ce contrat est conclu pour une durée indéterminée. Il prendra effet le 21 mai 2025.</p>
              </div>
              
              <div className="mb-4">
                <p className="font-bold text-blue-800">Article 2 - Période d'essai</p>
                <p>Le présent contrat est soumis à une période d'essai de trois mois renouvelable une fois.</p>
                <p>Durant cette période, chacune des parties pourra rompre le contrat sans préavis.</p>
              </div>
              
              <div className="mb-4">
                <p className="font-bold text-blue-800">Article 3 - Fonctions</p>
                <p>Le salarié exercera les fonctions de PDG.</p>
                <p>Ces fonctions sont susceptibles d'évoluer en fonction des besoins de l'entreprise.</p>
              </div>
              
              <div className="mb-4">
                <p className="font-bold text-blue-800">Article 4 - Rémunération</p>
                <p>La rémunération brute annuelle du salarié est fixée à 10000 euros.</p>
                <p>Cette rémunération sera versée sur 12 mois, à la fin de chaque mois.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 min-h-full">
              <div className="mb-4">
                <p className="font-bold text-blue-800">Article 3 - Rémunération</p>
                <p>En contrepartie de son travail, le/la Salarié(e) percevra une rémunération.</p>
                <p>Cette rémunération tiendra compte des heures éventuelles heures supplémentaires effectuées dans la limite du contingent annuel.</p>
              </div>
              
              <div className="mb-4">
                <p className="font-bold text-blue-800">Article 4 - Lieu de travail</p>
                <p>Le/La Salarié(e) exercera ses fonctions à/à l'adresse du lieu de travail.</p>
                <p>Toutefois, compte tenu de la nature des activités de la société et des nécessités du poste, le lieu de travail pourra.</p>
              </div>
              
              <div className="mb-4">
                <p className="font-bold text-blue-800">Article 5 - Horaires de travail</p>
                <p>Le/La Salarié(e) sera soumis(e) à l'horaire en vigueur dans l'entreprise, soit actuellement 35 heures hebdomadaires.</p>
                <p>- Du lundi au vendredi : de 9h00 à 17h00, avec une pause déjeuner d'une heure.</p>
              </div>
              
              <div className="mb-4">
                <p className="font-bold text-blue-800">Article 6 - Congés payés</p>
                <p>Le/La Salarié(e) bénéficiera des congés payés institués par les dispositions légales et conventionnelles, soit 2,5 jours.</p>
              </div>
              
              <div className="mb-4">
                <p className="font-bold text-blue-800">Article 7 - Obligations professionnelles</p>
                <p>Le/La Salarié(e) s'engage à respecter les directives et instructions émanant de la Direction et à se conformer aux règles.</p>
                <p>Le/La Salarié(e) s'engage à informer l'Employeur, sans délai, de tout changement qui interviendrait dans les situations.</p>
              </div>
              
              <div className="mt-12">
                <p className="mb-8">Fait en deux exemplaires originaux à (ville), le (date).</p>
                
                <div className="flex justify-between">
                  <div>
                    <p className="border-t border-black pt-2 w-40">Signature de l'Employeur</p>
                    <p className="text-xs">Précédée de la mention « Lu et approuvé »</p>
                  </div>
                  
                  <div>
                    <p className="border-t border-black pt-2 w-40">Signature du/de la Salarié(e)</p>
                    <p className="text-xs">Précédée de la mention « Lu et approuvé »</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 text-xs text-center text-gray-500">
                <p>Ce document est strictement confidentiel et établi conformément au droit du travail français. Il ne constitue pas un conseil juridique.</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center p-4 border-t">
          <div>
            Page {currentPage} / {totalPages}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Suivant <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Afficher le PDF selon son format (base64 ou URL)
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        {isBase64Data(document.fileUrl) ? (
          <iframe 
            src={document.fileUrl}
            className="w-full h-full border rounded-md"
            title="Contract PDF"
          />
        ) : (
          <object 
            data={document.fileUrl}
            type="application/pdf" 
            className="w-full h-full border rounded-md"
          >
            <p>Le navigateur ne peut pas afficher ce PDF. <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">Ouvrir le PDF</a></p>
          </object>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
