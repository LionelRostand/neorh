
import React, { useEffect } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BadgeFormValues } from "./FormSchema";
import { Info } from "lucide-react";

interface BasicInfoSectionProps {
  form: UseFormReturn<BadgeFormValues>;
  generatedBadgeNumber?: string;
}

export function BasicInfoSection({ form, generatedBadgeNumber }: BasicInfoSectionProps) {
  // Synchroniser le numéro généré avec le formulaire
  useEffect(() => {
    if (generatedBadgeNumber) {
      form.setValue("number", generatedBadgeNumber);
    }
  }, [generatedBadgeNumber, form]);

  return (
    <FormField
      control={form.control}
      name="number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Numéro de badge</FormLabel>
          <div className="relative">
            <FormControl>
              <Input 
                placeholder="Ex: B-12345" 
                {...field}
                value={generatedBadgeNumber || field.value || ""}
                className="bg-gray-50 pr-8"
                readOnly
                disabled
              />
            </FormControl>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 flex items-center">
              <Info size={16} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ce numéro est généré automatiquement et ne peut pas être modifié
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
