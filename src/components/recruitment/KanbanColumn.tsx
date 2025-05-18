
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { RecruitmentPost } from "@/types/recruitment";
import RecruitmentCard from "./RecruitmentCard";

interface KanbanColumnProps {
  id: string;
  title: string;
  items: RecruitmentPost[];
  onPostClick: (postId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, items, onPostClick }) => {
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
          <RecruitmentCard
            key={item.id}
            post={item}
            onClick={() => onPostClick(item.id)}
          />
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
