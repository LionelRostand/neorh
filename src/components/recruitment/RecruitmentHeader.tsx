
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecruitmentHeaderProps {
  onNewPostClick: () => void;
}

const RecruitmentHeader: React.FC<RecruitmentHeaderProps> = ({ onNewPostClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Recrutement</h1>
      <Button 
        className="bg-emerald-600 hover:bg-emerald-700"
        onClick={onNewPostClick}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Nouvelle offre
      </Button>
    </div>
  );
};

export default RecruitmentHeader;
