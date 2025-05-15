
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!employeeId) return;
    
    const fetchEmployeeEvaluations = async () => {
      setLoading(true);
      try {
        const result = await search([
          { field: 'employeeId', operator: '==', value: employeeId }
        ]);
        
        if (result.docs) {
          setEvaluations(result.docs);
        }
      } catch (err) {
        console.error("Error fetching employee evaluations:", err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        toast({
          title: "Erreur",
          description: "Impossible de charger les évaluations de l'employé",
          variant: "destructive"
        });
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
