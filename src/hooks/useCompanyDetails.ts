
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
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const { getById, isLoading: isLoadingFirestore } = useFirestore<Company>("hr_companies");

  const resetState = useCallback(() => {
    console.log("useCompanyDetails: Resetting state to initial values");
    setCompany(null);
    setError(null);
  }, []);

  const fetchCompany = useCallback(async (id: string) => {
    if (!id) {
      console.error("useCompanyDetails: ID d'entreprise manquant");
      setError(new Error("ID d'entreprise non spécifié"));
      return;
    }
    
    console.log("useCompanyDetails: Tentative de récupération de l'entreprise avec ID:", id);
    
    // Éviter les appels multiples pendant le chargement
    if (isLoadingLocal) {
      console.log("useCompanyDetails: Déjà en cours de chargement, requête ignorée");
      return;
    }
    
    setIsLoadingLocal(true);
    
    try {
      const result = await getById(id);
      
      console.log("useCompanyDetails: Résultat de la récupération:", result);
      
      if (result.docs && result.docs.length > 0) {
        const companyData = result.docs[0];
        // Make sure we have a proper company object with required fields
        const processedCompany: Company = {
          id: companyData.id || id,
          name: companyData.name || 'Entreprise sans nom',
          status: companyData.status || 'inactive',
          industry: companyData.industry || '',
          type: companyData.type || '',
          email: companyData.email || '',
          phone: companyData.phone || '',
          website: companyData.website || '',
          address: companyData.address || '',
          city: companyData.city || '',
          postalCode: companyData.postalCode || '',
          country: companyData.country || '',
          description: companyData.description || '',
          logoUrl: companyData.logoUrl || '',
          registrationDate: companyData.registrationDate || ''
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
    } finally {
      setIsLoadingLocal(false);
    }
  }, [getById]);

  // Combiner l'état de chargement local et Firestore
  const isLoading = isLoadingLocal || isLoadingFirestore;

  return {
    company,
    isLoading,
    error,
    fetchCompany,
    resetState
  };
};
