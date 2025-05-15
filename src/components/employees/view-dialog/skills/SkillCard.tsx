
import React from 'react';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skill } from '@/types/skill';
import { cn } from '@/lib/utils';

interface SkillCardProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skillId: string) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onEdit, onDelete }) => {
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-blue-100';
      case 2: return 'bg-blue-200';
      case 3: return 'bg-blue-300';
      case 4: return 'bg-blue-400';
      case 5: return 'bg-blue-500';
      default: return 'bg-blue-300';
    }
  };

  const levelText = (level: number) => {
    switch (level) {
      case 1: return 'Débutant';
      case 2: return 'Basique';
      case 3: return 'Intermédiaire';
      case 4: return 'Avancé';
      case 5: return 'Expert';
      default: return 'Non défini';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-base font-medium">{skill.name}</h4>
            {skill.category && (
              <p className="text-xs text-gray-500">{skill.category}</p>
            )}
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onEdit(skill)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500 hover:text-red-700" 
              onClick={() => onDelete(skill.id!)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>Niveau: {levelText(skill.level)}</span>
            <span className="font-medium">{skill.level}/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={cn("h-2 rounded-full", getLevelColor(skill.level))} 
              style={{ width: `${(skill.level / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {skill.description && (
          <p className="mt-3 text-sm text-gray-600">{skill.description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillCard;
