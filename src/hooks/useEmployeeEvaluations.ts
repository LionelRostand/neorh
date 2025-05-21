
import { useState, useEffect, useRef } from 'react';
import { useFirestore } from './useFirestore';
import { toast } from '@/components/ui/use-toast';

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
  
  // Pour éviter les requêtes en boucle si l'employeeId est vide
  const isInitialRender = useRef(true);
  const prevEmployeeId = useRef(employeeId);
  const fetchComplete = useRef(false); // Flag to prevent refetching

  useEffect(() => {
    // Ne pas exécuter la recherche si l'employeeId est vide
    if (!employeeId) {
      setLoading(false);
      setEvaluations([]);
      return;
    }
    
    // Éviter de lancer plusieurs requêtes avec le même ID ou si déjà chargé
    if ((!isInitialRender.current && prevEmployeeId.current === employeeId) || fetchComplete.current) {
      return;
    }
    
    isInitialRender.current = false;
    prevEmployeeId.current = employeeId;
    
    const fetchEmployeeEvaluations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching evaluations for employee ID: ${employeeId}`);
        
        // Use the search criteria object format
        const result = await search({
          field: 'employeeId',
          value: employeeId
        }, undefined, {
          sortField: 'date',
          sortDirection: 'desc'
        });
        
        if (result.docs) {
          console.log(`Found ${result.docs.length} evaluations`);
          setEvaluations(result.docs);
        } else {
          console.log('No evaluations found or empty result');
          setEvaluations([]);
        }
        
        fetchComplete.current = true; // Mark as completed
      } catch (err) {
        console.error("Error fetching employee evaluations:", err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        // Éviter d'afficher des toasts excessifs en cas d'erreurs répétées
        setEvaluations([]);
        fetchComplete.current = true; // Mark as completed even on error
      } finally {
        setLoading(false);
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
