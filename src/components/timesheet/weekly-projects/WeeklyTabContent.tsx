
import React from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import ProjectsTable from './ProjectsTable';
import ProjectSelector from './ProjectSelector';
import TotalDaysDisplay from './TotalDaysDisplay';
import { WeeklyTabContentProps } from "../types";

const WeeklyTabContent: React.FC<WeeklyTabContentProps> = ({ 
  week,
  weekIndex,
  projects,
  selectedProject,
  setSelectedProject,
  handleAddProject,
  handleUpdateDays,
  handleRemoveProject,
  handleSubmitWeek,
  isSubmittable,
  timesheet
}) => {
  // Calculate total days for this week
  const totalDays = week.projects.reduce((sum, project) => sum + project.days, 0);
  
  // Format dates for display
  const startDate = week.startDate ? format(parseISO(week.startDate), 'dd/MM/yyyy') : '';
  const endDate = week.endDate ? format(parseISO(week.endDate), 'dd/MM/yyyy') : '';
  
  const canSubmit = isSubmittable && totalDays > 0 && totalDays <= 5 && 
    (timesheet?.status === 'draft' || timesheet?.status === 'rejected');
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-500 font-medium">
            Semaine {week.week}: {startDate} - {endDate}
          </div>
          <TotalDaysDisplay currentDays={totalDays} maxDays={5} />
        </div>
        
        <ProjectSelector 
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          onAddProject={() => handleAddProject(weekIndex)}
        />
        
        <ProjectsTable 
          weekData={week} 
          weekIndex={weekIndex}
          projects={projects}
          onUpdateDays={handleUpdateDays}
          onRemoveProject={handleRemoveProject}
        />
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t px-6 py-3">
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-gray-500">
            {totalDays > 5 && (
              <span className="text-red-500">Le total des jours ne peut pas dépasser 5</span>
            )}
            {totalDays === 0 && (
              <span className="text-gray-500">Ajoutez au moins un projet pour soumettre</span>
            )}
          </div>
          <Button 
            onClick={() => handleSubmitWeek(weekIndex)}
            disabled={!canSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Soumettre
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WeeklyTabContent;
