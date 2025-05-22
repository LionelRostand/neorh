
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/hooks/firestore";
import { projectFormSchema, ProjectFormValues } from "../schema";
import { Project } from "@/types/project";

interface UseProjectFormProps {
  initialData?: Partial<Project>;
  onSuccess?: () => void;
}

export const useProjectForm = ({ initialData, onSuccess }: UseProjectFormProps) => {
  const { toast } = useToast();
  const firestore = useFirestore<Project>("hr_projects");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      status: initialData?.status || "pending",
      budget: initialData?.budget,
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure name is always provided (satisfying the Project type requirement)
      const projectData: Omit<Project, "id"> = {
        name: data.name, // This is required by the Project type
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        budget: data.budget,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting
  };
};
