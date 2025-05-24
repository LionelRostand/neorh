
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormProvider } from "@/components/ui/form";
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
  isLoading?: boolean;
}

const RecruitmentForm: React.FC<RecruitmentFormProps> = ({ onSubmit, isLoading = false }) => {
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
      ...values,
      status: values.candidateName ? 'en_cours' as const : 'ouverte' as const,
      applications: 0,
    };
    onSubmit(postData);
  };

  return (
    <FormProvider {...form}>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer l'offre"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default RecruitmentForm;
