
import React from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { RecruitmentPost, KanbanColumn } from "@/types/recruitment";
import KanbanColumn from "./KanbanColumn";

interface RecruitmentKanbanProps {
  posts: RecruitmentPost[];
  onStatusChange: (postId: string, newStatus: string) => void;
  onPostClick: (postId: string) => void;
}

const RecruitmentKanban: React.FC<RecruitmentKanbanProps> = ({ posts, onStatusChange, onPostClick }) => {
  const columns: KanbanColumn[] = [
    { id: 'ouverte', title: 'Ouverte', items: [] },
    { id: 'en_cours', title: 'En cours', items: [] },
    { id: 'entretiens', title: 'Entretiens', items: [] },
    { id: 'offre', title: 'Offre', items: [] },
    { id: 'fermée', title: 'Fermée', items: [] }
  ];
  
  // Distribute posts to their respective columns
  posts.forEach(post => {
    const column = columns.find(col => col.id === post.status);
    if (column) {
      column.items.push(post);
    }
  });
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    }),
    useSensor(KeyboardSensor)
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const postId = active.id.toString();
    const newStatus = over.id.toString();
    
    // Only update if the status changed
    const post = posts.find(p => p.id === postId);
    if (post && post.status !== newStatus) {
      onStatusChange(postId, newStatus);
    }
  };
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {columns.map(column => (
          <KanbanColumn 
            key={column.id}
            id={column.id}
            title={column.title}
            items={column.items}
            onPostClick={onPostClick}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default RecruitmentKanban;
