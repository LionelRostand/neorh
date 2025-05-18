
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { recruitmentFormSchema, RecruitmentFormValues } from "./schema";
import { RecruitmentPost } from "@/types/recruitment";

// Field components
import TitleField from "./fields/TitleField";
import DepartmentField from "./fields/DepartmentField";
import ContractTypeField from "./fields/ContractTypeField";
import PriorityField from "./fields/PriorityField";
import LocationField from "./fields/LocationField";
import DescriptionField from "./fields/DescriptionField";

interface RecruitmentFormProps {
  onSubmit: (data: Omit<RecruitmentPost, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const RecruitmentForm: React.FC<RecruitmentFormProps> = ({
  onSubmit,
  onCancel,
  isLoading
}) => {
  const form = useForm<RecruitmentFormValues>({
    resolver: zodResolver(recruitmentFormSchema),
    defaultValues: {
      title: "",
      department: "",
      description: "",
      location: "",
      contractType: "",
      status: "ouverte",
      priority: "medium"
    },
  });

  const handleSubmit = (values: RecruitmentFormValues) => {
    onSubmit(values as Omit<RecruitmentPost, 'id' | 'createdAt'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <TitleField />
        <DepartmentField />
        
        <div className="flex gap-4">
          <ContractTypeField />
          <PriorityField />
        </div>
        
        <LocationField />
        <DescriptionField />
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Créer l'offre"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default RecruitmentForm;
