
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

      <div className="space-y-3">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d'entreprise</FormLabel>
              <div className="flex flex-wrap gap-4">
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="radio"
                      id="type-client"
                      value="client"
                      checked={field.value === "client"}
                      onChange={() => field.onChange("client")}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel htmlFor="type-client" className="font-normal cursor-pointer">
                    Client
                  </FormLabel>
                </FormItem>
                
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="radio"
                      id="type-fournisseur"
                      value="fournisseur"
                      checked={field.value === "fournisseur"}
                      onChange={() => field.onChange("fournisseur")}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel htmlFor="type-fournisseur" className="font-normal cursor-pointer">
                    Fournisseur
                  </FormLabel>
                </FormItem>
                
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="radio"
                      id="type-partenaire"
                      value="partenaire"
                      checked={field.value === "partenaire"}
                      onChange={() => field.onChange("partenaire")}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel htmlFor="type-partenaire" className="font-normal cursor-pointer">
                    Partenaire
                  </FormLabel>
                </FormItem>
                
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="radio"
                      id="type-proprietaire"
                      value="proprietaire"
                      checked={field.value === "proprietaire"}
                      onChange={() => field.onChange("proprietaire")}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel htmlFor="type-proprietaire" className="font-normal cursor-pointer">
                    Propriétaire
                  </FormLabel>
                </FormItem>
                
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="radio"
                      id="type-local"
                      value="local"
                      checked={field.value === "local"}
                      onChange={() => field.onChange("local")}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel htmlFor="type-local" className="font-normal cursor-pointer">
                    Local
                  </FormLabel>
                </FormItem>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default BasicInfoSection;
