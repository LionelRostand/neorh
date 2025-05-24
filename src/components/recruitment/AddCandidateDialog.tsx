
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const candidateSchema = z.object({
  candidateName: z.string().min(1, "Le nom du candidat est requis"),
  nextStep: z.string().optional(),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

interface AddCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CandidateFormValues) => void;
  isLoading?: boolean;
}

const AddCandidateDialog: React.FC<AddCandidateDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false
}) => {
  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      candidateName: "",
      nextStep: "",
    },
  });

  const handleSubmit = (values: CandidateFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un candidat</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="candidateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du candidat</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nom et prénom du candidat"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nextStep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prochaine étape (optionnel)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Entretien technique, Validation manager..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Ajout..." : "Ajouter le candidat"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateDialog;
