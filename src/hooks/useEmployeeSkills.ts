
import { useState, useEffect, useCallback, useRef } from 'react';
import { useFirestore } from './useFirestore';
import { toast } from '@/components/ui/use-toast';
import { Skill } from '@/types/skill';

export function useEmployeeSkills(employeeId: string) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const { search, add, update, remove } = useFirestore<Skill>('hr_skills');

  const fetchEmployeeSkills = useCallback(async () => {
    // Utiliser une référence pour éviter des appels multiples simultanés
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      
      const result = await search('employeeId', employeeId, {
        sortField: 'name',
        sortDirection: 'asc'
      });
      
      if (result.docs) {
        setSkills(result.docs);
      } else {
        setSkills([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      console.error("Erreur lors du chargement des compétences:", err);
      // Éviter de montrer des toasts multiples en cas d'erreurs répétées
      if (!isFetchingRef.current) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les compétences de l'employé",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [employeeId, search]);

  const addSkill = useCallback(async (skill: Omit<Skill, 'id' | 'employeeId'>) => {
    try {
      const skillData = {
        ...skill,
        employeeId,
        createdAt: new Date().toISOString()
      };
      
      const resultId = await add(skillData);
      if (resultId) {
        // Fix the typing issue by correctly typing the new skill
        const newSkill: Skill = {
          ...skillData,
          id: resultId as string // Ensuring id is treated as string
        };
        
        setSkills(prevSkills => [...prevSkills, newSkill]);
        return resultId;
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la compétence",
        variant: "destructive"
      });
      return null;
    }
  }, [add, employeeId]);

  const updateSkill = useCallback(async (id: string, data: Partial<Skill>) => {
    try {
      const success = await update(id, data);
      if (success) {
        // Mettre à jour le state local au lieu de refaire un appel API complet
        setSkills(prevSkills => 
          prevSkills.map(skill => 
            skill.id === id ? { ...skill, ...data } : skill
          )
        );
      }
      return success;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la compétence",
        variant: "destructive"
      });
      return false;
    }
  }, [update]);

  const deleteSkill = useCallback(async (id: string) => {
    try {
      const success = await remove(id);
      if (success) {
        // Mettre à jour le state local au lieu de refaire un appel API complet
        setSkills(prevSkills => prevSkills.filter(skill => skill.id !== id));
      }
      return success;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la compétence",
        variant: "destructive"
      });
      return false;
    }
  }, [remove]);

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeSkills();
    }
    
    // Nettoyage lors du démontage du composant
    return () => {
      isFetchingRef.current = false;
    };
  }, [fetchEmployeeSkills, employeeId]);

  return {
    skills,
    loading,
    error,
    addSkill,
    updateSkill,
    deleteSkill,
    refresh: fetchEmployeeSkills
  };
}
