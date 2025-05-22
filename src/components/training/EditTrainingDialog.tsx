
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Training } from "@/hooks/useTrainingData";
import { useFirestore } from "@/hooks/firestore";
import { trainingSchema } from "./form/trainingSchema";
import { BasicInfoSection } from "./form/sections/BasicInfoSection";
import { DateSection } from "./form/sections/DateSection";
import { DescriptionSection } from "./form/sections/DescriptionSection";

interface EditTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  training: Training;
  onSuccess: () => void;
}

const EditTrainingDialog = ({
  open,
  onOpenChange,
  training,
  onSuccess,
}: EditTrainingDialogProps) => {
  const { update, isLoading } = useFirestore<Training>("hr_trainings");

  const form = useForm<z.infer<typeof trainingSchema>>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      title: training.title,
      description: training.description || "",
      type: training.type || "",
      location: training.location || "",
      organization: training.organization || "",
      status: training.status,
      startDate: training.startDate ? new Date(training.startDate) : undefined,
      endDate: training.endDate ? new Date(training.endDate) : undefined,
    },
  });

  const handleSubmit = async (data: z.infer<typeof trainingSchema>) => {
    try {
      await update(training.id, {
        ...data,
        startDate: data.startDate?.toISOString(),
        endDate: data.endDate?.toISOString(),
        // Conserver les champs existants qui ne sont pas dans le formulaire
        employeeId: training.employeeId,
        employeeName: training.employeeName,
        participants: training.participants,
      });

      toast({
        title: "Formation modifiée",
        description: "Les informations ont été mises à jour avec succès.",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier la formation.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la formation</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <BasicInfoSection form={form} />
            <DescriptionSection form={form} />
            <DateSection form={form} />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTrainingDialog;
