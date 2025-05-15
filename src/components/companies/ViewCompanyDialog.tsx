
import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import CompanyDetailsSkeleton from "./view-dialog/CompanyDetailsSkeleton";
import CompanyError from "./view-dialog/CompanyError";
import CompanyDetails from "./view-dialog/CompanyDetails";

interface ViewCompanyDialogProps {
  companyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewCompanyDialog = ({ companyId, open, onOpenChange }: ViewCompanyDialogProps) => {
  const { company, isLoading, error, fetchCompany, resetState } = useCompanyDetails();

  const handleClose = () => {
    onOpenChange(false);
  };

  useEffect(() => {
    // Only fetch when dialog is open and we have an ID
    if (open && companyId) {
      fetchCompany(companyId);
    }
    
    // Clean up state when dialog closes
    return () => {
      if (!open) {
        resetState();
      }
    };
  }, [open, companyId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <CompanyDetailsSkeleton />
        ) : error ? (
          <CompanyError onClose={handleClose} />
        ) : company ? (
          <CompanyDetails company={company} onClose={handleClose} />
        ) : (
          <CompanyDetailsSkeleton />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewCompanyDialog;
