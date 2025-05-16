
import { useState, useEffect, useCallback, useRef } from 'react';
import { useFirestore } from './useFirestore';
import { toast } from '@/components/ui/use-toast';
import { Skill } from '@/types/skill';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useEmployeeSkills(employeeId: string) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const { add, update, remove } = useFirestore<Skill>('hr_skills');

  const fetchEmployeeSkills = useCallback(async () => {
    // Si déjà en cours de récupération, ne pas exécuter à nouveau
    if (isFetchingRef.current || !employeeId) return;
    
    try {
      console.log(`Fetching skills for employee: ${employeeId}`);
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);
      
      // Utiliser Firebase directement au lieu de useFirestore.search pour éviter les problèmes d'indexation
      const skillsCollection = collection(db, 'hr_skills');
      const q = query(skillsCollection, where('employeeId', '==', employeeId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        console.log(`Found ${snapshot.docs.length} skills for employee ${employeeId}`);
        const loadedSkills: Skill[] = [];
        
        snapshot.forEach(doc => {
          loadedSkills.push({
            id: doc.id,
            ...(doc.data() as Omit<Skill, 'id'>)
          });
        });
        
        // Trier les compétences par nom côté client
        const sortedSkills = loadedSkills.sort((a, b) => 
          (a.name || '').localeCompare(b.name || '')
        );
        
        setSkills(sortedSkills);
      } else {
        console.log(`No skills found for employee ${employeeId}`);
        setSkills([]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des compétences:", err);
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      // Éviter de montrer des toasts multiples en cas d'erreurs répétées
      toast({
        title: "Erreur",
        description: "Impossible de charger les compétences de l'employé",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [employeeId]);

  const addSkill = useCallback(async (skill: Omit<Skill, 'id' | 'employeeId'>) => {
    try {
      const skillData = {
        ...skill,
        employeeId,
        createdAt: new Date().toISOString()
      };
      
      const resultId = await add(skillData);
      if (resultId) {
        // Créer correctement un nouvel objet Skill avec un ID typé comme string
        const newSkill: Skill = {
          ...skillData,
          id: String(resultId)
        };
        
        setSkills(prevSkills => [...prevSkills, newSkill]);
        return resultId;
      }
      return null;
    } catch (err) {
      console.error("Erreur lors de l'ajout d'une compétence:", err);
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
      console.error("Erreur lors de la mise à jour d'une compétence:", err);
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
      console.error("Erreur lors de la suppression d'une compétence:", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la compétence",
        variant: "destructive"
      });
      return false;
    }
  }, [remove]);

  useEffect(() => {
    let mounted = true;
    
    if (employeeId && mounted) {
      fetchEmployeeSkills();
    }
    
    // Nettoyage lors du démontage du composant
    return () => {
      mounted = false;
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
