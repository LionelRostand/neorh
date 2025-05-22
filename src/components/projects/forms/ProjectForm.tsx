
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/hooks/firestore";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project } from "@/types/project";

// Définition du schéma de validation du formulaire
const projectFormSchema = z.object({
  name: z.string().min(2, "Le nom du projet doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["active", "pending", "completed", "canceled"]).default("pending"),
  budget: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type ProjectFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<Project>;
};

export function ProjectForm({ onSuccess, onCancel, initialData }: ProjectFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore<Project>("hr_projects");

  // Initialiser le formulaire avec React Hook Form et Zod
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      status: initialData?.status || "pending",
      budget: initialData?.budget ? String(initialData.budget) : "",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      // Ajouter les dates de création/modification
      const projectData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Ajouter le projet à Firestore
      await firestore.add(projectData);
      
      toast({
        title: "Succès",
        description: "Le projet a été créé avec succès.",
      });

      // Réinitialiser le formulaire
      form.reset();
      
      // Appeler la fonction de callback si fournie
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du projet.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du projet</FormLabel>
              <FormControl>
                <Input placeholder="Nom du projet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description du projet" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de début</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ""} />
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
                <FormLabel>Date de fin prévue</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="canceled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Budget du projet" 
                    {...field} 
                    value={field.value || ""} 
                  />
                </FormControl>
                <FormDescription>Budget en euros</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit">Créer le projet</Button>
        </div>
      </form>
    </Form>
  );
}
