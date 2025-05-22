
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RecruitmentPost, RecruitmentStatus } from '@/types/recruitment';
import { toast } from '@/components/ui/use-toast';

export const useRecruitmentFirebaseData = () => {
  const [posts, setPosts] = useState<RecruitmentPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const recruitmentRef = collection(db, 'hr_recruitment');
    const q = query(recruitmentRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData: RecruitmentPost[] = [];
        
        snapshot.forEach((doc) => {
          postsData.push({ id: doc.id, ...doc.data() } as RecruitmentPost);
        });
        
        setPosts(postsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching recruitment data:', err);
        setError(err);
        setLoading(false);
        
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les offres de recrutement"
        });
      }
    );
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const updatePostStatus = async (postId: string, status: RecruitmentStatus) => {
    try {
      const postRef = doc(db, 'hr_recruitment', postId);
      await updateDoc(postRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de l'offre a été mis à jour avec succès"
      });
      
      return true;
    } catch (err) {
      console.error('Error updating post status:', err);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'offre"
      });
      
      return false;
    }
  };

  const updatePostDescription = async (postId: string, description: string) => {
    try {
      const postRef = doc(db, 'hr_recruitment', postId);
      await updateDoc(postRef, {
        description,
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Description mise à jour",
        description: "La description de l'offre a été mise à jour avec succès"
      });
      
      return true;
    } catch (err) {
      console.error('Error updating post description:', err);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la description de l'offre"
      });
      
      return false;
    }
  };

  const createNewPost = async (postData: Omit<RecruitmentPost, 'id' | 'createdAt'>) => {
    try {
      const recruitmentRef = collection(db, 'hr_recruitment');
      const newPost = {
        ...postData,
        createdAt: new Date().toISOString(),
        applications: 0
      };
      
      const docRef = await addDoc(recruitmentRef, newPost);
      
      toast({
        title: "Offre créée",
        description: "La nouvelle offre a été créée avec succès"
      });
      
      return { id: docRef.id, ...newPost } as RecruitmentPost;
    } catch (err) {
      console.error('Error creating new post:', err);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la nouvelle offre"
      });
      
      return null;
    }
  };

  return {
    posts,
    loading,
    error,
    updatePostStatus,
    updatePostDescription,
    createNewPost
  };
};

export default useRecruitmentFirebaseData;
