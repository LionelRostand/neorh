
import React from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { RecruitmentPost, RecruitmentStatus, KanbanColumn as KanbanColumnType } from "@/types/recruitment";
import KanbanColumn from "./KanbanColumn";
import AddCandidateDialog from "./AddCandidateDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

interface RecruitmentKanbanProps {
  posts: RecruitmentPost[];
  onStatusChange: (postId: string, newStatus: string) => void;
  onPostClick: (postId: string) => void;
  onPostDeleted?: () => void;
}

const RecruitmentKanban: React.FC<RecruitmentKanbanProps> = ({ 
  posts, 
  onStatusChange, 
  onPostClick,
  onPostDeleted 
}) => {
  const columns: KanbanColumnType[] = [
    { id: 'ouverte', title: 'Ouverte', items: [] },
    { id: 'en_cours', title: 'En cours', items: [] },
    { id: 'entretiens', title: 'Entretiens', items: [] },
    { id: 'offre', title: 'Offre', items: [] },
    { id: 'fermée', title: 'Fermée', items: [] }
  ];
  
  const [postToDelete, setPostToDelete] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [candidateDialogOpen, setCandidateDialogOpen] = React.useState(false);
  const [selectedPostForCandidate, setSelectedPostForCandidate] = React.useState<string | null>(null);
  const [isAddingCandidate, setIsAddingCandidate] = React.useState(false);
  
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

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
  };

  const handleAddCandidate = (postId: string) => {
    setSelectedPostForCandidate(postId);
    setCandidateDialogOpen(true);
  };

  const handleCandidateSubmit = async (data: { candidateName: string; nextStep?: string }) => {
    if (!selectedPostForCandidate) return;
    
    setIsAddingCandidate(true);
    try {
      const postRef = doc(db, 'hr_recruitment', selectedPostForCandidate);
      await updateDoc(postRef, {
        candidateName: data.candidateName,
        nextStep: data.nextStep || '',
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Candidat ajouté",
        description: "Le candidat a été ajouté avec succès à l'offre"
      });
      
      setCandidateDialogOpen(false);
      setSelectedPostForCandidate(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du candidat:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le candidat"
      });
    } finally {
      setIsAddingCandidate(false);
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    setIsDeleting(true);
    try {
      const postRef = doc(db, 'hr_recruitment', postToDelete);
      await deleteDoc(postRef);
      
      toast({
        title: "Offre supprimée",
        description: "L'offre a été supprimée avec succès"
      });
      
      if (onPostDeleted) {
        onPostDeleted();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'offre"
      });
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };
  
  return (
    <>
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
              onDeletePost={handleDeletePost}
              onAddCandidate={handleAddCandidate}
            />
          ))}
        </div>
      </DndContext>
      
      <AddCandidateDialog
        open={candidateDialogOpen}
        onOpenChange={setCandidateDialogOpen}
        onSubmit={handleCandidateSubmit}
        isLoading={isAddingCandidate}
      />
      
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RecruitmentKanban;
