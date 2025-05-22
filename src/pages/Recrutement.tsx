
import React, { useState, useEffect } from "react";
import { RecruitmentStatsData, RecruitmentPost } from "@/types/recruitment";

import RecruitmentHeader from "@/components/recruitment/RecruitmentHeader";
import RecruitmentStats from "@/components/recruitment/RecruitmentStats";
import RecruitmentViewTabs from "@/components/recruitment/RecruitmentViewTabs";
import RecruitmentDialogs from "@/components/recruitment/RecruitmentDialogs";

import useRecruitmentFirebaseData from "@/hooks/useRecruitmentFirebaseData";
import useRecruitmentToEmployee from "@/hooks/useRecruitmentToEmployee";

const Recrutement = () => {
  const { posts, loading, error, updatePostStatus, updatePostDescription, createNewPost } = useRecruitmentFirebaseData();
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
    return convertToEmployee(post).then((success) => {
      if (success) {
        setViewDialogOpen(false);
      }
      return success;
    });
  };

  const handleNewPostClick = () => {
    setNewPostDialogOpen(true);
  };

  const handlePostDeleted = () => {
    // Rafraîchir les stats après suppression
    // (useRecruitmentFirebaseData gère déjà la mise à jour de la liste)
  };

  return (
    <div className="container py-6">
      <RecruitmentHeader onNewPostClick={handleNewPostClick} />
      
      <RecruitmentStats stats={stats} isLoading={loading} />
      
      <RecruitmentViewTabs 
        viewMode={viewMode}
        setViewMode={setViewMode}
        posts={posts}
        loading={loading}
        onPostClick={handlePostClick}
        onStatusChange={handleStatusChange}
        onPostDeleted={handlePostDeleted}
      />
      
      <RecruitmentDialogs 
        newPostDialogOpen={newPostDialogOpen}
        setNewPostDialogOpen={setNewPostDialogOpen}
        viewDialogOpen={viewDialogOpen}
        setViewDialogOpen={setViewDialogOpen}
        selectedPost={selectedPost}
        onCreatePost={handleCreatePost}
        onStatusChange={handleStatusChange}
        onConvertToEmployee={handleConvertToEmployee}
        isLoading={loading}
        isConverting={converting}
      />
    </div>
  );
};

export default Recrutement;
