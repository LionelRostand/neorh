import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CompanyFormValues } from "../../form/types";
import CompanyLogoUpload from "../../CompanyLogoUpload";

interface BasicInfoSectionProps {
  form: {
    control: Control<CompanyFormValues>;
    formState: any;
  };
  logoPreview: string;
  onLogoChange: (file: File) => void;
  onResetLogo: () => void;
}

const BasicInfoSection = ({
  form,
  logoPreview,
  onLogoChange,
  onResetLogo,
}: BasicInfoSectionProps) => {
  // Adaptateur pour convertir l'événement en File
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onLogoChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informations de base</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
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

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type d'entreprise</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="client" id="client" />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="client">
                      Client
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="fournisseur" id="fournisseur" />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="fournisseur">
                      Fournisseur
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="partenaire" id="partenaire" />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="partenaire">
                      Partenaire
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Statut</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="active" id="active" />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="active">
                      Actif
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="pending" id="pending" />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="pending">
                      En attente
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="inactive" id="inactive" />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="inactive">
                      Inactif
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="registrationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'enregistrement</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="md:col-span-2">
        <FormLabel>Logo de l'entreprise</FormLabel>
        <CompanyLogoUpload
          logoUrl={logoPreview}
          onLogoChange={handleLogoChange}
          onReset={onResetLogo}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
