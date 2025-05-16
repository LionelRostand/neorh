
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { Company } from '@/types/company';

export const useCompaniesData = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Récupération des données des entreprises...");
      const companiesCollection = collection(db, 'hr_companies');
      const companiesSnapshot = await getDocs(companiesCollection);
      
      console.log(`Nombre d'entreprises trouvées: ${companiesSnapshot.docs.length}`);
      
      const companiesData = companiesSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`Données pour ${doc.id}:`, data);
        
        return {
          id: doc.id,
          name: data.name || 'Entreprise inconnue',
          industry: data.industry || '',
          type: data.type || '',
          status: data.status || 'inactive',
          logoUrl: data.logoUrl || '',
          email: data.email || '',
          phone: data.phone || '',
          website: data.website || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
          country: data.country || '',
          description: data.description || '',
          registrationDate: data.registrationDate || null,
          // Support pour l'ancien format de logo
          logo: data.logo ? {
            base64: data.logo.base64 || '',
            type: data.logo.type || '',
            name: data.logo.name || '',
          } : undefined
        } as Company;
      });
      
      console.log(`Traitement terminé, ${companiesData.length} entreprises chargées`);
      setCompanies(companiesData);
    } catch (err) {
      console.error("Erreur lors du chargement des entreprises:", err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Erreur de chargement",
        description: `Impossible de charger les données des entreprises: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
