
import { toast } from "@/components/ui/use-toast";

export const showSuccessToast = (message: string, title = "Succès") => {
  toast({
    title: title,
    description: message,
  });
};

export const showErrorToast = (message: string, title = "Erreur") => {
  toast({
    variant: "destructive",
    title: title,
    description: message,
  });
};

export const showInfoToast = (message: string, title = "Information") => {
  toast({
    title: title,
    description: message,
  });
};
