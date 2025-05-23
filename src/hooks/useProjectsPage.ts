
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/hooks/firestore";
import { Project } from "@/types/project";
import { HR } from "@/lib/constants/collections";

export const useProjectsPage = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  
  // États pour les nouveaux dialogues
  const [viewProjectDialogOpen, setViewProjectDialogOpen] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [deleteProjectDialogOpen, setDeleteProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const projectsFirestore = useFirestore<Project>("hr_projets");

  // Load projects data
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const result = await projectsFirestore.getAll();
      if (result.docs) {
        setProjects(result.docs);
        
        // Calculate statistics
        const total = result.docs.length;
        const active = result.docs.filter(p => p.status === "active").length;
        const pending = result.docs.filter(p => p.status === "pending").length;
        const expired = result.docs.filter(p => p.status === "canceled").length;
        
        setStats({
          total,
          active,
          pending,
          expired
        });
      }
    } catch (err) {
      console.error("Erreur lors du chargement des projets:", err);
      setError(err instanceof Error ? err : new Error("Erreur inconnue"));
      
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const handleNewProject = () => {
    setNewProjectDialogOpen(true);
  };

  const handleEdit = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setEditProjectDialogOpen(true);
    }
  };

  const handleDelete = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setDeleteProjectDialogOpen(true);
    }
  };

  const handleView = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setViewProjectDialogOpen(true);
    }
  };

  return {
    projects,
    isLoading,
    error,
    stats,
    newProjectDialogOpen,
    setNewProjectDialogOpen,
    viewProjectDialogOpen,
    setViewProjectDialogOpen,
    editProjectDialogOpen,
    setEditProjectDialogOpen,
    deleteProjectDialogOpen,
    setDeleteProjectDialogOpen,
    selectedProject,
    loadProjects,
    handleNewProject,
    handleEdit,
    handleDelete,
    handleView
  };
};
