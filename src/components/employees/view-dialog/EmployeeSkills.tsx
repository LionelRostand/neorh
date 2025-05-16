
import React, { useState, useCallback, memo, useMemo } from 'react';
import { Employee } from '@/types/employee';
import { Skill } from '@/types/skill';
import { useEmployeeSkills } from '@/hooks/useEmployeeSkills';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AddSkillDialog from './skills/AddSkillDialog';
import EditSkillDialog from './skills/EditSkillDialog';
import SkillCard from './skills/SkillCard';
import { Skeleton } from '@/components/ui/skeleton';

interface EmployeeSkillsProps {
  employee: Employee;
}

// Utiliser memo pour éviter les rendus inutiles
const SkillCard_Memoized = memo(SkillCard);

const EmployeeSkills: React.FC<EmployeeSkillsProps> = ({ employee }) => {
  const { skills, loading, addSkill, updateSkill, deleteSkill } = useEmployeeSkills(employee.id);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);

  const handleAddSkill = useCallback(async (skill: Omit<Skill, 'id' | 'employeeId'>) => {
    await addSkill(skill);
    setIsAddDialogOpen(false);
  }, [addSkill]);

  const handleUpdateSkill = useCallback(async (id: string, skill: Partial<Skill>) => {
    await updateSkill(id, skill);
    setIsEditDialogOpen(false);
  }, [updateSkill]);

  const handleDeleteSkill = useCallback(async () => {
    if (currentSkill && currentSkill.id) {
      await deleteSkill(currentSkill.id);
      setIsDeleteDialogOpen(false);
    }
  }, [currentSkill, deleteSkill]);

  const openEditDialog = useCallback((skill: Skill) => {
    setCurrentSkill(skill);
    setIsEditDialogOpen(true);
  }, []);
  
  const openDeleteDialog = useCallback((skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
      setCurrentSkill(skill);
      setIsDeleteDialogOpen(true);
    }
  }, [skills]);

  // Grouper les compétences par catégorie avec useMemo pour éviter les recalculs inutiles
  const categorizedSkills = useMemo(() => {
    const categorized: { [key: string]: Skill[] } = {};
    
    skills.forEach(skill => {
      const category = skill.category || 'Non classé';
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(skill);
    });
    
    return categorized;
  }, [skills]);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold">Compétences</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold">Compétences</h3>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            size="sm" 
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter une compétence
          </Button>
        </div>
        
        {skills.length === 0 ? (
          <div className="text-center py-10 border rounded-lg bg-gray-50">
            <p className="text-gray-500">Aucune compétence enregistrée pour cet employé.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une compétence
            </Button>
          </div>
        ) : (
          <>
            {Object.entries(categorizedSkills).map(([category, categorySkills]) => (
              <div key={category} className="mb-6">
                <h4 className="text-lg font-medium mb-3">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map(skill => (
                    <SkillCard_Memoized 
                      key={skill.id} 
                      skill={skill}
                      onEdit={openEditDialog}
                      onDelete={openDeleteDialog}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      
      <AddSkillDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddSkill={handleAddSkill}
      />
      
      {currentSkill && (
        <EditSkillDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          skill={currentSkill}
          onUpdateSkill={handleUpdateSkill}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la compétence "{currentSkill?.name}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSkill} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default React.memo(EmployeeSkills);
