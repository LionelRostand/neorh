
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form,
} from "@/components/ui/form";
import { Building } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

import { companyFormSchema, CompanyFormProps, CompanyFormValues } from "./types";
import BasicInfoSection from "./BasicInfoSection";
import ContactSection from "./ContactSection";
import LocationSection from "./LocationSection";
import DescriptionSection from "./DescriptionSection";
import FormActions from "./FormActions";

const CompanyForm = ({ onCancel, onSuccess }: CompanyFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { 
    logoFile, 
    logoPreview, 
    isUploading, 
    handleLogoChange, 
    uploadLogo,
    resetLogo
  } = useLogoUpload();
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
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
      type: "client",
      status: "active",
      registrationDate: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data: CompanyFormValues) => {
    setIsLoading(true);
    try {
      // Récupérer les données du logo en base64
      const logoData = await uploadLogo();
      
      // Préparer les données pour Firestore
      const companyData: any = {
        ...data,
        createdAt: new Date(),
      };
      
      // Ajouter les données du logo s'il existe
      if (logoData && logoData.base64) {
        companyData.logo = {
          base64: logoData.base64,
          type: logoData.type,
          name: logoData.name
        };
      }

      // Ajouter à Firestore
      const docRef = await addDoc(collection(db, 'hr_companies'), companyData);
      
      toast({
        title: "Succès",
        description: "L'entreprise a été créée avec succès"
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de la création de l'entreprise:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'entreprise",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Building className="h-5 w-5 mr-2" />
        <h2 className="text-xl font-bold">Nouvelle entreprise</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoSection 
            form={form} 
            logoPreview={logoPreview}
            onLogoChange={handleLogoChange}
            onResetLogo={resetLogo}
          />
          
          <ContactSection form={form} />
          
          <LocationSection form={form} />
          
          <DescriptionSection form={form} />
          
          <FormActions 
            onCancel={onCancel} 
            isLoading={isLoading} 
            isUploading={isUploading}
          />
        </form>
      </Form>
    </div>
  );
};

export default CompanyForm;
