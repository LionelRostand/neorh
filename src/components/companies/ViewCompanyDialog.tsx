
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useFirestore } from "@/hooks/useFirestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Building, Globe, Mail, Phone, MapPin, Calendar, Loader2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Company {
  id?: string;
  name: string;
  industry?: string;
  type?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  description?: string;
  logoUrl?: string;
  registrationDate?: string;
  status: string;
}

interface ViewCompanyDialogProps {
  companyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewCompanyDialog = ({ companyId, open, onOpenChange }: ViewCompanyDialogProps) => {
  const [company, setCompany] = React.useState<Company | null>(null);
  const { getById, isLoading, error } = useFirestore<Company>("hr_companies");

  React.useEffect(() => {
    const fetchCompany = async () => {
      if (companyId && open) {
        const result = await getById(companyId);
        if (result) {
          setCompany(result);
        }
      }
    };

    fetchCompany();
  }, [companyId, open, getById]);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="mt-2 text-gray-600">Chargement des informations...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !company) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-red-500">Impossible de charger les informations de l'entreprise</p>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="mt-4">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{company.name}</h2>
            <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
              {company.status || "Statut inconnu"}
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
                        className="object-contain h-full w-full"
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
                        className="text-blue-600 hover:underline"
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
                      {company.city && company.postalCode && (
                        <p>
                          {company.postalCode} {company.city}
                        </p>
                      )}
                      {company.country && <p>{company.country}</p>}
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCompanyDialog;
