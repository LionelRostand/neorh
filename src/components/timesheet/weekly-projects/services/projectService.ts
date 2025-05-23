
import { toast } from "@/components/ui/use-toast";
import { useFirestore } from '@/hooks/firestore';
import { Project } from "../../types";

export const useProjectService = () => {
  const projectsCollection = useFirestore('hr_projets');

  const loadProjects = async (): Promise<Project[]> => {
    try {
      console.log("Loading projects from Firestore for timesheet...");
      const result = await projectsCollection.getAll();
      
      console.log("Raw projects result:", result);
      
      if (result.docs && result.docs.length > 0) {
        // Map all projects (not just active ones) for timesheet selection
        const projectsData = result.docs.map(project => ({
          id: project.id || '',
          name: project.name || 'Projet sans nom'
        }));
        
        console.log("All projects for timesheet:", projectsData);
        
        if (projectsData.length === 0) {
          console.warn("No projects found for timesheet");
          toast({
            title: "Information",
            description: "Aucun projet trouvé. Veuillez créer des projets dans le menu Projets.",
            variant: "default"
          });
        } else {
          console.log(`Found ${projectsData.length} projects for timesheet selection`);
        }
        
        return projectsData;
      } else {
        console.log("No projects found in database for timesheet");
        toast({
          title: "Information",
          description: "Aucun projet trouvé. Veuillez créer des projets dans le menu Projets.",
          variant: "default"
        });
        return [];
      }
    } catch (err) {
      console.error("Error loading projects for timesheet:", err);
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
