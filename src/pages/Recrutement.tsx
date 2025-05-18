
import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Clock, 
  Check, 
  Users, 
  Calendar, 
  Kanban, 
  List, 
  PlusCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RecruitmentStatsData, RecruitmentPost } from "@/types/recruitment";

import RecruitmentStats from "@/components/recruitment/RecruitmentStats";
import RecruitmentKanban from "@/components/recruitment/RecruitmentKanban";
import RecruitmentList from "@/components/recruitment/RecruitmentList";
import NewPostDialog from "@/components/recruitment/NewPostDialog";
import ViewPostDialog from "@/components/recruitment/ViewPostDialog";
import useRecruitmentFirebaseData from "@/hooks/useRecruitmentFirebaseData";
import useRecruitmentToEmployee from "@/hooks/useRecruitmentToEmployee";

const Recrutement = () => {
  const { posts, loading, error, updatePostStatus, createNewPost } = useRecruitmentFirebaseData();
  const { converting, convertToEmployee } = useRecruitmentToEmployee();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<RecruitmentPost | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  const [stats, setStats] = useState<RecruitmentStatsData>({
    openPositions: 0,
    inProgress: 0,
    filledPositions: 0,
    applications: 0,
    interviews: 0
  });
  
  // Calculate stats based on posts
  useEffect(() => {
    if (posts.length > 0) {
      const openPositions = posts.filter(post => post.status === 'ouverte').length;
      const inProgress = posts.filter(post => post.status === 'en_cours').length;
      const entretiens = posts.filter(post => post.status === 'entretiens').length;
      const offres = posts.filter(post => post.status === 'offre').length;
      const fermees = posts.filter(post => post.status === 'fermée').length;
      
      const totalApplications = posts.reduce((sum, post) => sum + (post.applications || 0), 0);
      
      setStats({
        openPositions,
        inProgress: inProgress + entretiens + offres,
        filledPositions: fermees,
        applications: totalApplications,
        interviews: entretiens
      });
    }
  }, [posts]);
  
  const handlePostClick = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setViewDialogOpen(true);
    }
  };
  
  const handleStatusChange = (postId: string, newStatus: string) => {
    updatePostStatus(postId, newStatus as any);
  };
  
  const handleCreatePost = async (data: Omit<RecruitmentPost, 'id' | 'createdAt'>) => {
    const success = await createNewPost(data);
    if (success) {
      setNewPostDialogOpen(false);
    }
  };

  const handleConvertToEmployee = (post: RecruitmentPost) => {
    convertToEmployee(post).then((success) => {
      if (success) {
        setViewDialogOpen(false);
      }
    });
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recrutement</h1>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setNewPostDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle offre
        </Button>
      </div>
      
      <RecruitmentStats stats={stats} isLoading={loading} />
      
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
              onStatusChange={handleStatusChange} 
              onPostClick={handlePostClick} 
            />
          )}
        </TabsContent>
        
        <TabsContent value="list">
          {loading ? (
            <div className="w-full h-96 bg-gray-100 animate-pulse rounded-md"></div>
          ) : (
            <RecruitmentList posts={posts} onPostClick={handlePostClick} />
          )}
        </TabsContent>
      </Tabs>
      
      <NewPostDialog 
        open={newPostDialogOpen}
        onOpenChange={setNewPostDialogOpen}
        onSubmit={handleCreatePost}
        isLoading={loading}
      />
      
      <ViewPostDialog 
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        post={selectedPost}
        onStatusChange={handleStatusChange}
        onConvertToEmployee={handleConvertToEmployee}
        isConverting={converting}
      />
    </div>
  );
};

export default Recrutement;
