
import React from "react";
import { Kanban, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RecruitmentPost } from "@/types/recruitment";
import RecruitmentKanban from "./RecruitmentKanban";
import RecruitmentList from "./RecruitmentList";

interface RecruitmentViewTabsProps {
  viewMode: 'kanban' | 'list';
  setViewMode: (mode: 'kanban' | 'list') => void;
  posts: RecruitmentPost[];
  loading: boolean;
  onPostClick: (postId: string) => void;
  onStatusChange: (postId: string, newStatus: string) => void;
}

const RecruitmentViewTabs: React.FC<RecruitmentViewTabsProps> = ({
  viewMode,
  setViewMode,
  posts,
  loading,
  onPostClick,
  onStatusChange
}) => {
  return (
    <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'kanban' | 'list')}>
      <div className="flex items-center gap-2 mb-4">
        <TabsList>
          <TabsTrigger value="kanban">
            <Kanban className="h-4 w-4 mr-2" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" />
            Liste
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="kanban" className="mt-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[70vh] bg-gray-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : (
          <RecruitmentKanban 
            posts={posts} 
            onStatusChange={onStatusChange} 
            onPostClick={onPostClick} 
          />
        )}
      </TabsContent>
      
      <TabsContent value="list">
        {loading ? (
          <div className="w-full h-96 bg-gray-100 animate-pulse rounded-md"></div>
        ) : (
          <RecruitmentList posts={posts} onPostClick={onPostClick} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default RecruitmentViewTabs;
