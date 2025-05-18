
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProjectsTable from "@/components/projects/ProjectsTable";
import ProjectsStats from "@/components/projects/ProjectsStats";

const Projets = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0
  });
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Pour le moment, nous utilisons un tableau vide
      // Dans une implémentation réelle, vous chargeriez les données depuis Firebase
      setProjects([]);
      setStats({
        total: 0,
        active: 0,
        pending: 0,
        expired: 0
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleNewProject = () => {
    toast({
      title: "Fonction en développement",
      description: "La création de projets sera bientôt disponible."
    });
    // Ici, vous ajouteriez l'ouverture d'un dialogue pour créer un nouveau projet
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
    <div className="space-y-6">
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

      {/* Debug info */}
      <div className="text-xs text-gray-500 text-center pt-4 border-t">
        Nombre de projets: {projects.length}
      </div>
    </div>
  );
};

export default Projets;
