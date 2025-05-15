
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Building } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import useFirestore from "@/hooks/useFirestore";
import EditCompanyForm, { CompanyFormValues } from "./edit/EditCompanyForm";
import EditCompanyLoading from "./edit/EditCompanyLoading";
import EditCompanyError from "./edit/EditCompanyError";

interface EditCompanyDialogProps {
  companyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditCompanyDialog = ({ companyId, open, onOpenChange, onSuccess }: EditCompanyDialogProps) => {
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [initialData, setInitialData] = useState<CompanyFormValues>({
    name: "",
    industry: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    description: "",
    logoUrl: "",
    type: "client",
    status: "active",
    registrationDate: new Date().toISOString().split('T')[0]
  });
  
  const { getById, update, isLoading } = useFirestore<CompanyFormValues & { 
    logo?: { base64: string, type: string, name: string } 
  }>("hr_companies");
  
  // Load company data
  useEffect(() => {
    const fetchCompany = async () => {
      if (companyId && open) {
        setIsLoadingCompany(true);
        try {
          const company = await getById(companyId);
          if (company) {
            setInitialData({
              name: company.name || "",
              industry: company.industry || "",
              email: company.email || "",
              phone: company.phone || "",
              website: company.website || "",
              address: company.address || "",
              city: company.city || "",
              postalCode: company.postalCode || "",
              country: company.country || "",
              description: company.description || "",
              logoUrl: company.logoUrl || (company.logo?.base64 || ""),
              type: company.type || "client",
              status: company.status || "active",
              registrationDate: company.registrationDate || new Date().toISOString().split('T')[0]
            });
          }
        } catch (error) {
          setLoadError(error instanceof Error ? error : new Error('Erreur lors du chargement des données'));
          toast({
            title: "Erreur",
            description: "Impossible de charger les données de l'entreprise",
            variant: "destructive"
          });
        } finally {
          setIsLoadingCompany(false);
        }
      }
    };

    fetchCompany();
  }, [companyId, open, getById]);

  // Updated the function signature to match what EditCompanyForm is passing
  const handleSubmit = async (data: CompanyFormValues, logoData: { base64: string | null, type: string | null, name: string | null } | null) => {
    try {
      // If there's a new logo file, we'll handle the upload in the form component
      let updatedData: any = { ...data };
      
      // If we have new logo data in base64 format, add it to the update data
      if (logoData && logoData.base64) {
        updatedData.logo = {
          base64: logoData.base64,
          type: logoData.type,
          name: logoData.name
        };
      }
      
      await update(companyId, updatedData);
      
      toast({
        title: "Succès",
        description: "Entreprise mise à jour avec succès"
      });
      
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'entreprise",
        variant: "destructive"
      });
    }
  };

  // Render different content based on loading/error state
  const renderContent = () => {
    if (isLoadingCompany) {
      return <EditCompanyLoading />;
    }
    
    if (loadError) {
      return <EditCompanyError onClose={() => onOpenChange(false)} />;
    }
    
    return (
      <>
        <div className="flex items-center mb-6">
          <Building className="h-5 w-5 mr-2" />
          <h2 className="text-xl font-bold">Modifier l'entreprise</h2>
        </div>
        
        <EditCompanyForm
          companyId={companyId}
          initialData={initialData}
          isUpdating={isLoading}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDialog;
