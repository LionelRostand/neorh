
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BadgeFormValues } from "./FormSchema";
import { InfoCircle } from "lucide-react";

interface BasicInfoSectionProps {
  form: UseFormReturn<BadgeFormValues>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
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
                className="bg-gray-50 pr-8"
                readOnly
                disabled
              />
            </FormControl>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 flex items-center">
              <InfoCircle size={16} />
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
