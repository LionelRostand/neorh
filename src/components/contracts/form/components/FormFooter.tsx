
import React from "react";
import { Button } from "@/components/ui/button";

interface FormFooterProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function FormFooter({ onCancel, isSubmitting = false }: FormFooterProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" onClick={onCancel} type="button">
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
        Créer le contrat
      </Button>
    </div>
  );
}
