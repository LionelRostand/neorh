
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
  
  // Utiliser useRef pour suivre si une requête a déjà été effectuée
  const fetchedRef = useRef(false);
  
  useEffect(() => {
    // Ne pas exécuter la recherche si l'employeeId est vide
    if (!employeeId) {
      setLoading(false);
      setEvaluations([]);
      return;
    }
    
    // N'exécuter la requête qu'une seule fois par employeeId
    if (fetchedRef.current) {
      return;
    }
    
    const fetchEmployeeEvaluations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching evaluations for employee ID: ${employeeId}`);
        
        const result = await search({
          field: 'employeeId',
          value: employeeId
        });
        
        if (result.docs) {
          console.log(`Found ${result.docs.length} evaluations`);
          setEvaluations(result.docs);
        } else {
          console.log('No evaluations found or empty result');
          setEvaluations([]);
        }
        
        // Marquer comme complété après la requête réussie
        fetchedRef.current = true;
      } catch (err) {
        console.error("Error fetching employee evaluations:", err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        setEvaluations([]);
        // Marquer comme complété même en cas d'erreur pour éviter les requêtes infinies
        fetchedRef.current = true;
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
