
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RecruitmentPost } from "@/types/recruitment";

import { recruitmentFormSchema, RecruitmentFormValues } from "./schema";
import TitleField from "./fields/TitleField";
import DepartmentField from "./fields/DepartmentField";
import DescriptionField from "./fields/DescriptionField";
import LocationField from "./fields/LocationField";
import ContractTypeField from "./fields/ContractTypeField";
import PriorityField from "./fields/PriorityField";
import CandidateField from "./fields/CandidateField";
import NextStepField from "./fields/NextStepField";

interface RecruitmentFormProps {
  onSubmit: (data: Omit<RecruitmentPost, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const RecruitmentForm: React.FC<RecruitmentFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const form = useForm<RecruitmentFormValues>({
    resolver: zodResolver(recruitmentFormSchema),
    defaultValues: {
      title: "",
      department: "",
      description: "",
      requirements: [],
      location: "",
      contractType: "",
      priority: "medium",
      candidateName: "",
      nextStep: "",
    },
  });

  const handleSubmit = (values: RecruitmentFormValues) => {
    const postData = {
      title: values.title,
      department: values.department,
      description: values.description,
      requirements: values.requirements,
      location: values.location,
      contractType: values.contractType,
      priority: values.priority,
      candidateName: values.candidateName,
      nextStep: values.nextStep,
      status: values.candidateName ? 'en_cours' as const : 'ouverte' as const,
      applications: 0,
    };
    onSubmit(postData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TitleField />
          <DepartmentField />
        </div>
        
        <DescriptionField />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LocationField />
          <ContractTypeField />
        </div>
        
        <PriorityField />
        
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3">Candidat (optionnel)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CandidateField />
            <NextStepField />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Création..." : "Créer l'offre"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecruitmentForm;
