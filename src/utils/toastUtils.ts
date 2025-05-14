
import { toast } from '@/components/ui/use-toast';

export const showSuccessToast = (description: string) => {
  toast({
    title: "Succès",
    description,
  });
};

export const showErrorToast = (description: string) => {
  toast({
    title: "Erreur",
    description,
    variant: "destructive"
  });
};
