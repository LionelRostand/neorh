
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CompanyLogoUpload from "../CompanyLogoUpload";
import { CompanyFormValues } from "./types";

interface BasicInfoSectionProps {
  form: UseFormReturn<CompanyFormValues>;
  logoPreview: string | null;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetLogo: () => void;
}

const BasicInfoSection = ({ form, logoPreview, onLogoChange, onResetLogo }: BasicInfoSectionProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l'entreprise *</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de l'entreprise" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full md:w-1/3">
          <FormLabel>Logo de l'entreprise</FormLabel>
          <CompanyLogoUpload 
            logoUrl={logoPreview}
            onLogoChange={onLogoChange}
            onReset={onResetLogo}
          />
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Secteur d'activité</FormLabel>
            <FormControl>
              <Input placeholder="Secteur d'activité" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoSection;
