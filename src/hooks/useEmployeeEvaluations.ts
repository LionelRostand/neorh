
import { useState, useEffect, useRef } from 'react';
import { useFirestore } from './firestore';
import { SearchOptions } from './firestore/searchOperations';
import { showErrorToast } from '@/utils/toastUtils';

export interface Evaluation {
  id: string;
  employeeId: string;
  title: string;
  date: string;
  evaluator: string;
  status: "planifiée" | "complétée" | "annulée";
  comments?: string;
}

export const useEmployeeEvaluations = (employeeId: string) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { search } = useFirestore<Evaluation>('hr_evaluations');
  
  // Pour éviter les requêtes en boucle
  const isInitialRender = useRef(true);
  const prevEmployeeId = useRef(employeeId);
  const hasLoadedData = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Ne pas exécuter la recherche si l'employeeId est vide
    if (!employeeId) {
      setLoading(false);
      setEvaluations([]);
      return;
    }
    
    // Éviter de lancer plusieurs requêtes avec le même ID
    if (!isInitialRender.current && 
        prevEmployeeId.current === employeeId && 
        hasLoadedData.current) {
      return;
    }
    
    isInitialRender.current = false;
    prevEmployeeId.current = employeeId;
    
    const fetchEmployeeEvaluations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching evaluations for employee ID: ${employeeId}`);
        
        // Éviter les problèmes d'index en ne spécifiant pas le tri
        const searchOptions: SearchOptions = {};
        
        const result = await search('employeeId', employeeId, searchOptions);
        
        // Vérifier que le composant est toujours monté
        if (!isMounted.current) return;
        
        if (result.docs) {
          console.log(`Found ${result.docs.length} evaluations`);
          // Trier côté client
          const sortedDocs = [...result.docs].sort((a, b) => {
            if (a.date && b.date) {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            return 0;
          });
          setEvaluations(sortedDocs);
        } else {
          console.log('No evaluations found or empty result');
          setEvaluations([]);
        }
        
        // Marquer comme chargé
        hasLoadedData.current = true;
      } catch (err) {
        // Vérifier que le composant est toujours monté
        if (!isMounted.current) return;
        
        console.error("Error fetching employee evaluations:", err);
        const fetchError = err instanceof Error ? err : new Error('Erreur inconnue');
        setError(fetchError);
        
        // Message d'erreur plus convivial pour les erreurs d'index
        if (fetchError.message.includes('index')) {
          showErrorToast(`Erreur d'index Firebase. Veuillez contacter l'administrateur.`);
        } else {
          showErrorToast(`Impossible de charger les évaluations: ${fetchError.message}`);
        }
        
        setEvaluations([]);
      } finally {
        // Vérifier que le composant est toujours monté
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchEmployeeEvaluations();
  }, [employeeId, search]);

  return {
    evaluations,
    loading,
    error
  };
};
