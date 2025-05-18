
import React from "react";
import { RecruitmentPost } from "@/types/recruitment";
import NewPostDialog from "./NewPostDialog";
import ViewPostDialog from "./ViewPostDialog";

interface RecruitmentDialogsProps {
  newPostDialogOpen: boolean;
  setNewPostDialogOpen: (open: boolean) => void;
  viewDialogOpen: boolean;
  setViewDialogOpen: (open: boolean) => void;
  selectedPost: RecruitmentPost | null;
  onCreatePost: (data: Omit<RecruitmentPost, 'id' | 'createdAt'>) => Promise<any>;
  onStatusChange: (postId: string, newStatus: string) => void;
  onConvertToEmployee: (post: RecruitmentPost) => Promise<boolean>;
  isLoading: boolean;
  isConverting: boolean;
}

const RecruitmentDialogs: React.FC<RecruitmentDialogsProps> = ({
  newPostDialogOpen,
  setNewPostDialogOpen,
  viewDialogOpen,
  setViewDialogOpen,
  selectedPost,
  onCreatePost,
  onStatusChange,
  onConvertToEmployee,
  isLoading,
  isConverting
}) => {
  return (
    <>
      <NewPostDialog 
        open={newPostDialogOpen}
        onOpenChange={setNewPostDialogOpen}
        onSubmit={onCreatePost}
        isLoading={isLoading}
      />
      
      <ViewPostDialog 
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        post={selectedPost}
        onStatusChange={onStatusChange}
        onConvertToEmployee={onConvertToEmployee}
        isConverting={isConverting}
      />
    </>
  );
};

export default RecruitmentDialogs;
