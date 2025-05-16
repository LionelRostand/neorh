
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
    
    console.log("useCompanyDetails: Tentative de récupération de l'entreprise avec ID:", id);
    
    try {
      const result = await getById(id);
      
      console.log("useCompanyDetails: Résultat de la récupération:", result);
      
      if (result) {
        // Make sure we have a proper company object with required fields
        const processedCompany: Company = {
          id: result.id,
          ...result,
          status: result.status || 'inactive',
          name: result.name || 'Entreprise sans nom'
        };
        
        console.log("useCompanyDetails: Entreprise traitée:", processedCompany);
        setCompany(processedCompany);
      } else {
        console.error("useCompanyDetails: Entreprise non trouvée pour l'ID:", id);
        setError(new Error("Entreprise non trouvée"));
        toast({
          title: "Erreur",
          description: "Impossible de trouver cette entreprise",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("useCompanyDetails: Erreur lors du chargement de l'entreprise:", err);
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
