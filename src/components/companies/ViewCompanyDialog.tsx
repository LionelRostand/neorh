
import React, { useEffect, useCallback } from "react";
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

  // Memoize the handleClose to avoid recreating on each render
  const handleClose = useCallback(() => {
    console.log("ViewCompanyDialog: Fermeture demandée");
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    // Only fetch when dialog is open and we have a valid ID
    if (open && companyId) {
      console.log("ViewCompanyDialog: Fetching company data for ID:", companyId);
      fetchCompany(companyId);
    }
    
    // Clean up state when dialog closes
    return () => {
      if (!open) {
        console.log("ViewCompanyDialog: Resetting company details state");
        resetState();
      }
    };
  }, [open, companyId, fetchCompany, resetState]);

  console.log("ViewCompanyDialog: Current state:", { 
    companyId, 
    open, 
    isLoading, 
    hasError: !!error, 
    hasCompany: !!company 
  });

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        {isLoading && !company ? (
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
