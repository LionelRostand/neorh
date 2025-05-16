
import React, { useState, useEffect } from "react";
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
  console.log("EditCompanyForm: Rendering with initialData:", initialData);
  
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
  useEffect(() => {
    if (initialData.logoUrl) {
      console.log("EditCompanyForm: Setting initial logo preview:", initialData.logoUrl.substring(0, 30) + "...");
      setLogoPreview(initialData.logoUrl);
    } else {
      console.log("EditCompanyForm: No initial logo URL");
    }
  }, [initialData.logoUrl, setLogoPreview]);
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: initialData,
    mode: "onChange"
  });

  useEffect(() => {
    console.log("EditCompanyForm: Form reset with initialData");
    form.reset(initialData);
  }, [initialData, form]);

  const handleSubmit = async (data: CompanyFormValues) => {
    console.log("EditCompanyForm: Form submitted with data:", data);
    const logoData = await uploadLogo();
    console.log("EditCompanyForm: Logo data after upload:", logoData ? "Has logo data" : "No logo data");
    await onSubmit(data, logoData);
  };

  // Function to handle the file directly
  const handleFileChange = (file: File) => {
    handleLogoChange({ target: { files: [file] } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoSection
          form={form}
          logoPreview={logoPreview || ""}
          onLogoChange={handleFileChange}
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
