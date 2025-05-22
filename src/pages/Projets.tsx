
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProjectsTable from "@/components/projects/ProjectsTable";
import ProjectsStats from "@/components/projects/ProjectsStats";
import NewProjectDialog from "@/components/projects/NewProjectDialog";
import { useFirestore } from "@/hooks/firestore";
import { Project } from "@/types/project";

const Projets = () => {
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
  
  const projectsFirestore = useFirestore<Project>("hr_projects");

  // Charger les données
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const result = await projectsFirestore.getAll();
      if (result.docs) {
        setProjects(result.docs);
        
        // Calculer les statistiques
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

  // Charger les données au montage du composant
  useEffect(() => {
    loadProjects();
  }, []);

  const handleNewProject = () => {
    setNewProjectDialogOpen(true);
  };

  const handleEdit = (projectId: string) => {
    toast({
      title: "Fonction en développement",
      description: `Édition du projet ${projectId} sera bientôt disponible.`
    });
  };

  const handleDelete = (projectId: string) => {
    toast({
      title: "Fonction en développement",
      description: `Suppression du projet ${projectId} sera bientôt disponible.`
    });
  };

  const handleView = (projectId: string) => {
    toast({
      title: "Fonction en développement",
      description: `Affichage du projet ${projectId} sera bientôt disponible.`
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with title and button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des projets</h1>
        <Button onClick={handleNewProject}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau
        </Button>
      </div>

      {/* Status Cards */}
      <ProjectsStats stats={stats} />

      {/* Projects table */}
      <ProjectsTable
        projects={projects}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* New project dialog */}
      <NewProjectDialog
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
        onSuccess={loadProjects}
      />

      {/* Debug info */}
      <div className="text-xs text-gray-500 text-center pt-4 border-t">
        Nombre de projets: {projects.length}
      </div>
    </div>
  );
};

export default Projets;
