
import React from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RecruitmentStatus } from "@/types/recruitment";

interface StatusOption {
  value: RecruitmentStatus;
  label: string;
  color: string;
}

interface PostHeaderProps {
  title: string;
  status: RecruitmentStatus;
  contractType?: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ title, status, contractType }) => {
  const statusOptions: StatusOption[] = [
    { value: 'ouverte', label: 'Ouverte', color: 'bg-blue-100 text-blue-800' },
    { value: 'en_cours', label: 'En cours', color: 'bg-amber-100 text-amber-800' },
    { value: 'entretiens', label: 'Entretiens', color: 'bg-purple-100 text-purple-800' },
    { value: 'offre', label: 'Offre', color: 'bg-green-100 text-green-800' },
    { value: 'fermée', label: 'Fermée', color: 'bg-gray-100 text-gray-800' }
  ];

  const currentStatusOption = statusOptions.find(option => option.value === status);

  return (
    <>
      <DialogTitle className="text-xl">{title}</DialogTitle>
      <div className="flex items-center gap-2 mt-2">
        <Badge variant="outline" className={currentStatusOption?.color}>
          {currentStatusOption?.label}
        </Badge>
        {contractType && <Badge variant="outline">{contractType}</Badge>}
      </div>
    </>
  );
};

export default PostHeader;
