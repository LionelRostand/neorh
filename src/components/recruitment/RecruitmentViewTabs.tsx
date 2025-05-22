
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecruitmentPost } from "@/types/recruitment";
import RecruitmentKanban from "./RecruitmentKanban";
import RecruitmentList from "./RecruitmentList";
import { KanbanIcon, ListIcon } from "lucide-react";

interface RecruitmentViewTabsProps {
  viewMode: 'kanban' | 'list';
  setViewMode: (mode: 'kanban' | 'list') => void;
  posts: RecruitmentPost[];
  loading: boolean;
  onPostClick: (postId: string) => void;
  onStatusChange: (postId: string, newStatus: string) => void;
  onPostDeleted?: () => void;
}

const RecruitmentViewTabs: React.FC<RecruitmentViewTabsProps> = ({ 
  viewMode, 
  setViewMode, 
  posts, 
  loading, 
  onPostClick, 
  onStatusChange,
  onPostDeleted
}) => {
  return (
    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'kanban' | 'list')} className="mt-6">
      <div className="flex justify-between mb-4 items-center">
        <TabsList>
          <TabsTrigger value="kanban" className="flex items-center gap-1">
            <KanbanIcon className="h-4 w-4" />
            <span>Kanban</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-1">
            <ListIcon className="h-4 w-4" />
            <span>Liste</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="kanban" className="mt-0">
        <RecruitmentKanban 
          posts={posts} 
          onStatusChange={onStatusChange} 
          onPostClick={onPostClick}
          onPostDeleted={onPostDeleted}
        />
      </TabsContent>
      
      <TabsContent value="list" className="mt-0">
        <RecruitmentList 
          posts={posts} 
          loading={loading} 
          onPostClick={onPostClick}
        />
      </TabsContent>
    </Tabs>
  );
};

export default RecruitmentViewTabs;
