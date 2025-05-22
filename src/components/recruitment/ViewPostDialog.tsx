
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RecruitmentPost } from "@/types/recruitment";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";

// Import our components
import PostHeader from "./dialog/PostHeader";
import PostDetailsCard from "./dialog/PostDetailsCard";
import CandidateCard from "./dialog/CandidateCard";
import PostInfoCard from "./dialog/PostInfoCard";
import StatusChangeCard from "./dialog/StatusChangeCard";

interface ViewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: RecruitmentPost | null;
  onStatusChange: (postId: string, status: string) => void;
  onConvertToEmployee: (post: RecruitmentPost) => void;
  isConverting: boolean;
}

const ViewPostDialog: React.FC<ViewPostDialogProps> = ({
  open,
  onOpenChange,
  post,
  onStatusChange,
  onConvertToEmployee,
  isConverting
}) => {
  const { departments } = useDepartmentsData();

  if (!post) return null;

  const handleStatusChange = (status: string) => {
    onStatusChange(post.id, status);
  };

  const handleConvertToEmployee = () => {
    onConvertToEmployee(post);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <PostHeader 
            title={post.title} 
            status={post.status} 
            contractType={post.contractType} 
          />
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <PostDetailsCard 
              description={post.description || ""}
              requirements={post.requirements}
            />

            {post.candidateName && (
              <CandidateCard 
                post={post} 
                isConverting={isConverting}
                onConvertToEmployee={handleConvertToEmployee}
              />
            )}
          </div>

          <div className="space-y-4">
            <PostInfoCard 
              title={post.title}
              location={post.location}
              createdAt={post.createdAt}
              applications={post.applications}
              departmentId={post.department}
              departments={departments}
            />

            <StatusChangeCard 
              currentStatus={post.status}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPostDialog;
