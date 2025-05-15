
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

export interface Company {
  id: string;
  name: string;
  industry?: string;
  type?: string;
  status?: string;
}

export const useCompaniesData = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const companiesCollection = collection(db, 'hr_companies');
      const companiesSnapshot = await getDocs(companiesCollection);
      
      const companiesData = companiesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || '',
        industry: doc.data().industry || '',
        type: doc.data().type || '',
        status: doc.data().status || ''
      }));
      
      setCompanies(companiesData);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(err instanceof Error ? err : new Error(errorMessage));
      setIsLoading(false);
      
      toast({
        title: "Erreur de chargement",
        description: `Impossible de charger les données des entreprises: ${errorMessage}`,
        variant: "destructive"
      });
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    isLoading,
    error,
    refetch: fetchCompanies
  };
};
