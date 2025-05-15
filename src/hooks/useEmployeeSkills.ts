
import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from './useFirestore';
import { toast } from '@/components/ui/use-toast';
import { Skill } from '@/types/skill';

export function useEmployeeSkills(employeeId: string) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { search, add, update, remove } = useFirestore<Skill>('hr_skills');

  const fetchEmployeeSkills = useCallback(async () => {
    setLoading(true);
    try {
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
      toast({
        title: "Erreur",
        description: "Impossible de charger les compétences de l'employé",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [employeeId, search]);

  const addSkill = async (skill: Omit<Skill, 'id' | 'employeeId'>) => {
    try {
      const newSkill = {
        ...skill,
        employeeId,
        createdAt: new Date().toISOString()
      };
      
      const result = await add(newSkill);
      if (result) {
        await fetchEmployeeSkills();
        return result;
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la compétence",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateSkill = async (id: string, data: Partial<Skill>) => {
    try {
      const success = await update(id, data);
      if (success) {
        await fetchEmployeeSkills();
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
  };

  const deleteSkill = async (id: string) => {
    try {
      const success = await remove(id);
      if (success) {
        await fetchEmployeeSkills();
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
  };

  useEffect(() => {
    fetchEmployeeSkills();
  }, [fetchEmployeeSkills]);

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
