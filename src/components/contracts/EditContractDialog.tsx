
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import useFirestore from "@/hooks/useFirestore";
import { Contract } from "@/lib/constants";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Schema for form validation
const schema = z.object({
  employeeName: z.string().min(3, { message: "Le nom de l'employé est requis" }),
  position: z.string().min(1, { message: "Le poste est requis" }),
  type: z.string().min(1, { message: "Le type de contrat est requis" }),
  startDate: z.string().min(1, { message: "La date de début est requise" }),
  endDate: z.string().optional(),
  status: z.enum(["draft", "pending", "active", "expired", "pending_signature"], { 
    message: "Le statut doit être valide" 
  })
});

type FormValues = z.infer<typeof schema>;

interface EditContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract | null;
  onSuccess: () => void;
}

export default function EditContractDialog({
  open,
  onOpenChange,
  contract,
  onSuccess
}: EditContractDialogProps) {
  const firestore = useFirestore<Contract>('hr_contracts');
  
  // Initialize form with contract data
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeName: contract?.employeeName || '',
      position: contract?.position || '',
      type: contract?.type || 'CDI',
      startDate: contract?.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '',
      endDate: contract?.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : '',
      status: contract?.status || 'draft'
    },
    // Update form values when contract changes
    values: contract ? {
      employeeName: contract.employeeName || '',
      position: contract.position || '',
      type: contract.type || 'CDI',
      startDate: contract.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '',
      endDate: contract.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : '',
      status: contract.status || 'draft'
    } : undefined
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!contract?.id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le contrat: ID manquant"
      });
      return;
    }

    try {
      // Format dates
      const updatedContract: Partial<Contract> = {
        ...data,
        startDate: data.startDate,
        endDate: data.endDate || null
      };

      // Update contract in Firestore
      await firestore.update(contract.id, updatedContract);
      
      toast({
        title: "Succès",
        description: "Le contrat a été mis à jour avec succès"
      });
      
      onOpenChange(false);
      onSuccess(); // Refresh contracts list
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contrat:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le contrat"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le contrat</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'employé</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom de l'employé" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poste</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Poste" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de contrat</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de contrat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="Alternance">Alternance</SelectItem>
                      <SelectItem value="Stage">Stage</SelectItem>
                      <SelectItem value="Intérim">Intérim</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin (optionnelle)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="pending_signature">En attente de signature</SelectItem>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="expired">Expiré</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Enregistrer les modifications</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
