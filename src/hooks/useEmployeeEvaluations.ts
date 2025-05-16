
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

  useEffect(() => {
    // Ne pas exécuter la recherche si l'employeeId est vide
    if (!employeeId) {
      setLoading(false);
      setEvaluations([]);
      return;
    }
    
    // Éviter de lancer plusieurs requêtes avec le même ID
    if (!isInitialRender.current && prevEmployeeId.current === employeeId) {
      return;
    }
    
    isInitialRender.current = false;
    prevEmployeeId.current = employeeId;
    
    const fetchEmployeeEvaluations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching evaluations for employee ID: ${employeeId}`);
        
        const result = await search('employeeId', employeeId, {
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
      } catch (err) {
        console.error("Error fetching employee evaluations:", err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        // Éviter d'afficher des toasts excessifs en cas d'erreurs répétées
        setEvaluations([]);
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
