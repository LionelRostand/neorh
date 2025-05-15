
import { toast } from "@/hooks/use-toast";

export const showSuccessToast = (message: string) => {
  toast({
    title: "Succès",
    description: message,
    variant: "default",
  });
};

export const showErrorToast = (message: string) => {
  toast({
    title: "Erreur",
    description: message,
    variant: "destructive",
  });
};

export const showInfoToast = (message: string) => {
  toast({
    title: "Information",
    description: message,
  });
};
