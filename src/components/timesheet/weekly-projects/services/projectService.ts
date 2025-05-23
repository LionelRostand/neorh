
import { toast } from "@/components/ui/use-toast";
import { useFirestore } from '@/hooks/firestore';
import { Project } from "../types";

export const useProjectService = () => {
  const projectsCollection = useFirestore('hr_projets');

  const loadProjects = async (): Promise<Project[]> => {
    try {
      console.log("Loading projects from Firestore...");
      const result = await projectsCollection.getAll();
      
      console.log("Raw projects result:", result);
      
      if (result.docs && result.docs.length > 0) {
        const projectsData = result.docs
          .filter(project => {
            console.log("Project status:", project.status);
            return project.status === 'active';
          })
          .map(project => ({
            id: project.id || '',
            name: project.name || 'Projet sans nom'
          }));
        
        console.log("Filtered active projects:", projectsData);
        
        if (projectsData.length === 0) {
          console.warn("No active projects found");
          toast({
            title: "Information",
            description: "Aucun projet actif trouvé. Veuillez créer des projets dans le menu Projets.",
            variant: "default"
          });
        }
        
        return projectsData;
      } else {
        console.log("No projects found in database");
        toast({
          title: "Information",
          description: "Aucun projet trouvé. Veuillez créer des projets dans le menu Projets.",
          variant: "default"
        });
        return [];
      }
    } catch (err) {
      console.error("Error loading projects:", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets depuis la base de données",
        variant: "destructive"
      });
      return [];
    }
  };

  return { loadProjects };
};
