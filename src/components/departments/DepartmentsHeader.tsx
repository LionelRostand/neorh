
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DepartmentsHeaderProps {
  onNewDepartment: () => void;
}

const DepartmentsHeader: React.FC<DepartmentsHeaderProps> = ({ onNewDepartment }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Gestion des départements</h1>
      <Button onClick={onNewDepartment}>
        <Plus className="h-4 w-4 mr-2" />
        Nouveau
      </Button>
    </div>
  );
};

export default DepartmentsHeader;
