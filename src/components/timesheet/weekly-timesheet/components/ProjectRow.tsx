
import React from 'react';
import { X } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Project, WeeklyProjectTime } from "../../types";

interface ProjectRowProps {
  project: WeeklyProjectTime;
  projectIndex: number;
  weekIndex: number;
  projectDetails: Project;
  onUpdateDays: (weekIndex: number, projectIndex: number, days: number) => void;
  onRemoveProject: (weekIndex: number, projectIndex: number) => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ 
  project, 
  projectIndex, 
  weekIndex, 
  projectDetails,
  onUpdateDays,
  onRemoveProject
}) => {
  return (
    <TableRow>
      <TableCell>{projectDetails.id}</TableCell>
      <TableCell>{projectDetails.name}</TableCell>
      <TableCell className="w-32">
        <Input 
          type="number" 
          min="0" 
          max="5" 
          value={project.days} 
          onChange={(e) => onUpdateDays(weekIndex, projectIndex, parseFloat(e.target.value))}
          className="w-20"
        />
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onRemoveProject(weekIndex, projectIndex)}
          className="h-8 w-8 p-0 text-red-500"
        >
          <X className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ProjectRow;
