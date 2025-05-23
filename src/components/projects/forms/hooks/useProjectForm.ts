
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/hooks/firestore";
import { projectFormSchema, ProjectFormValues } from "../schema";
import { Project } from "@/types/project";
import { HR } from "@/lib/constants/collections";

interface UseProjectFormProps {
  initialData?: Partial<Project>;
  onSuccess?: () => void;
  isEdit?: boolean;
}

export const useProjectForm = ({ initialData, onSuccess, isEdit = false }: UseProjectFormProps) => {
  const { toast } = useToast();
  const firestore = useFirestore<Project>(HR.PROJECTS);
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
      const projectData: Omit<Project, "id"> = {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        budget: data.budget,
        createdAt: isEdit ? initialData?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isEdit && initialData?.id) {
        // Mettre à jour le projet existant
        await firestore.update(initialData.id, projectData);
        toast({
          title: "Succès",
          description: "Le projet a été mis à jour avec succès.",
        });
      } else {
        // Créer un nouveau projet
        await firestore.add(projectData);
        toast({
          title: "Succès",
          description: "Le projet a été créé avec succès.",
        });
      }

      // Réinitialiser le formulaire seulement si ce n'est pas une édition
      if (!isEdit) {
        form.reset();
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du projet:", error);
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de la ${isEdit ? 'mise à jour' : 'création'} du projet.`,
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
