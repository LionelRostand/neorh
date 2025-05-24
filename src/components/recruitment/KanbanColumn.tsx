
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { RecruitmentPost } from "@/types/recruitment";
import RecruitmentCard from "./RecruitmentCard";
import { Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KanbanColumnProps {
  id: string;
  title: string;
  items: RecruitmentPost[];
  onPostClick: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onAddCandidate?: (postId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  id, 
  title, 
  items, 
  onPostClick,
  onDeletePost,
  onAddCandidate 
}) => {
  const { setNodeRef } = useDroppable({
    id: id
  });
  
  return (
    <div 
      ref={setNodeRef} 
      className="bg-gray-100 rounded-md p-3 min-h-[70vh]"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
          {items.length}
        </span>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="relative group">
            <RecruitmentCard
              post={item}
              onClick={() => onPostClick(item.id)}
            />
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              {id === 'en_cours' && !item.candidateName && onAddCandidate && (
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white text-green-600 hover:text-green-700 hover:bg-green-50 h-6 w-6 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddCandidate(item.id);
                  }}
                  title="Ajouter un candidat"
                >
                  <UserPlus className="h-3 w-3" />
                </Button>
              )}
              {onDeletePost && (
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePost(item.id);
                  }}
                  title="Supprimer l'offre"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="bg-white/50 border border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500 text-sm">
            Aucune offre
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
