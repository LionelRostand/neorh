
import { useState, useCallback } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { Company } from '@/types/company';
import { toast } from '@/components/ui/use-toast';

interface UseCompanyDetailsResult {
  company: Company | null;
  isLoading: boolean;
  error: Error | null;
  fetchCompany: (id: string) => Promise<void>;
  resetState: () => void;
}

export const useCompanyDetails = (): UseCompanyDetailsResult => {
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { getById, isLoading } = useFirestore<Company>("hr_companies");

  const resetState = useCallback(() => {
    setCompany(null);
    setError(null);
  }, []);

  const fetchCompany = useCallback(async (id: string) => {
    if (!id) {
      setError(new Error("ID d'entreprise non spécifié"));
      return;
    }
    
    try {
      const result = await getById(id);
      
      if (result) {
        // Make sure we have a proper company object with required fields
        const processedCompany: Company = {
          ...result,
          status: result.status || 'inactive',
          name: result.name || 'Entreprise sans nom'
        };
        
        setCompany(processedCompany);
      } else {
        setError(new Error("Entreprise non trouvée"));
        toast({
          title: "Erreur",
          description: "Impossible de trouver cette entreprise",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Erreur lors du chargement de l'entreprise:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Erreur de chargement",
        description: `Impossible de charger les informations de l'entreprise: ${errorMessage}`,
        variant: "destructive"
      });
    }
  }, [getById]);

  return {
    company,
    isLoading,
    error,
    fetchCompany,
    resetState
  };
};
