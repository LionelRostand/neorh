
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CompanyFormValues } from "./types";

interface DescriptionSectionProps {
  form: UseFormReturn<CompanyFormValues>;
}

const DescriptionSection = ({ form }: DescriptionSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Description de l'entreprise" 
              className="min-h-[120px]"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DescriptionSection;
