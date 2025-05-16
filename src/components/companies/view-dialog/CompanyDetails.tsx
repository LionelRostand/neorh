
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Company } from "@/types/company";
import { Building, Globe, Mail, Phone, MapPin, Calendar, Printer } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { exportCompanyToPdf } from "@/utils/company/pdfExport";
import { toast } from "@/components/ui/use-toast";

interface CompanyDetailsProps {
  company: Company;
  onClose: () => void;
}

const CompanyDetails = ({ company, onClose }: CompanyDetailsProps) => {
  console.log("Rendering CompanyDetails with data:", company);

  const handlePrint = () => {
    try {
      exportCompanyToPdf(company);
      toast({
        title: "Succès",
        description: "Le PDF a été généré avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive"
      });
    }
  };

  // Safety check for status
  const status = company.status || 'inactive';
  
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{company.name || 'Entreprise sans nom'}</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium
          ${status === 'active' ? 'bg-green-100 text-green-700' : 
            status === 'pending' ? 'bg-amber-100 text-amber-700' : 
            'bg-gray-100 text-gray-700'}`}>
          {status === 'active' ? 'Actif' : 
           status === 'pending' ? 'En attente' : 
           status === 'inactive' ? 'Inactif' : 'Statut inconnu'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 p-4">
          <div className="flex flex-col items-center gap-4">
            {company.logoUrl ? (
              <div className="w-full">
                <AspectRatio ratio={1} className="bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={company.logoUrl}
                    alt={`Logo ${company.name}`}
                    className="object-contain h-full w-full p-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                      console.error("Failed to load company logo:", company.logoUrl);
                    }}
                  />
                </AspectRatio>
              </div>
            ) : (
              <Avatar className="h-24 w-24 text-2xl">
                <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500">
                  {company.name?.charAt(0) || "?"}
                </div>
              </Avatar>
            )}
            <h3 className="font-semibold text-center">{company.industry || "Secteur non spécifié"}</h3>
            <div className="text-sm text-gray-500 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {company.registrationDate ? new Date(company.registrationDate).toLocaleDateString() : "Date non spécifiée"}
            </div>
          </div>
        </Card>

        <Card className="col-span-1 md:col-span-2 p-6">
          <h3 className="font-semibold mb-4">Informations générales</h3>
          <div className="space-y-4">
            {company.description && (
              <div className="mb-4 text-gray-700">
                {company.description}
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">
                    {company.email}
                  </a>
                </div>
              )}

              {company.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a href={`tel:${company.phone}`} className="text-blue-600 hover:underline">
                    {company.phone}
                  </a>
                </div>
              )}

              {company.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <a
                    href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {company.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {(company.address || company.city || company.postalCode || company.country) && (
            <>
              <h3 className="font-semibold mt-6 mb-4">Adresse</h3>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  {company.address && <p>{company.address}</p>}
                  {(company.city || company.postalCode) && (
                    <p>
                      {company.postalCode && `${company.postalCode} `}{company.city}
                    </p>
                  )}
                  {company.country && <p>{company.country}</p>}
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={handlePrint} 
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </Button>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </div>
  );
};

export default CompanyDetails;
