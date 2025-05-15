
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { companyFormSchema, CompanyFormValues } from "../form/types";

import BasicInfoSection from "./sections/BasicInfoSection";
import ContactSection from "./sections/ContactSection";
import LocationSection from "./sections/LocationSection";
import DescriptionSection from "./sections/DescriptionSection";
import FormActions from "./sections/FormActions";

interface EditCompanyFormProps {
  companyId: string;
  initialData: CompanyFormValues;
  isUpdating: boolean;
  onSubmit: (data: CompanyFormValues, logoData: { base64: string | null, type: string | null, name: string | null } | null) => Promise<void>;
  onCancel: () => void;
}

const EditCompanyForm = ({ 
  companyId, 
  initialData, 
  isUpdating, 
  onSubmit, 
  onCancel 
}: EditCompanyFormProps) => {
  const { 
    logoFile, 
    logoPreview, 
    setLogoPreview,
    isUploading, 
    handleLogoChange, 
    uploadLogo,
    resetLogo
  } = useLogoUpload();
  
  // Set initial logo if exists
  React.useEffect(() => {
    if (initialData.logoUrl) {
      setLogoPreview(initialData.logoUrl);
    }
  }, [initialData.logoUrl, setLogoPreview]);
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: initialData
  });

  const handleSubmit = async (data: CompanyFormValues) => {
    const logoData = await uploadLogo();
    await onSubmit(data, logoData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
          isUpdating={isUpdating}
          isUploading={isUploading}
        />
      </form>
    </Form>
  );
};

export default EditCompanyForm;
