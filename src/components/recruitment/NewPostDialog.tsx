
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RecruitmentPost } from "@/types/recruitment";
import RecruitmentForm from "./form/RecruitmentForm";

interface NewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<RecruitmentPost, 'id' | 'createdAt'>) => void;
  isLoading: boolean;
}

const NewPostDialog: React.FC<NewPostDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isLoading 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle offre de recrutement</DialogTitle>
          <DialogDescription>
            Créez une nouvelle offre d'emploi à publier
          </DialogDescription>
        </DialogHeader>
        <RecruitmentForm
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewPostDialog;
