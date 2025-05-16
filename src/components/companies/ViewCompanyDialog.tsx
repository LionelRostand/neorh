
import React, { useEffect, useCallback, useState } from "react";
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
  // Utiliser un état local pour suivre si nous avons déjà chargé les données
  const [dataFetched, setDataFetched] = useState(false);
  const { company, isLoading, error, fetchCompany, resetState } = useCompanyDetails();

  // Memoize the handleClose to avoid recreating on each render
  const handleClose = useCallback(() => {
    console.log("ViewCompanyDialog: Fermeture demandée");
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    // Si le dialogue est fermé, réinitialiser l'état
    if (!open) {
      setDataFetched(false);
      resetState();
      return;
    }
    
    // Seulement charger les données lorsque la boîte de dialogue est ouverte, que nous avons un ID, et que nous n'avons pas déjà chargé
    if (open && companyId && !dataFetched) {
      console.log("ViewCompanyDialog: Fetching company data for ID:", companyId);
      fetchCompany(companyId);
      setDataFetched(true);
    }
  }, [open, companyId, fetchCompany, resetState, dataFetched]);

  console.log("ViewCompanyDialog: Current state:", { 
    companyId, 
    open, 
    isLoading, 
    hasError: !!error, 
    hasCompany: !!company,
    dataFetched
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
