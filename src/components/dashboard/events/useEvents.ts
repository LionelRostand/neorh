
import { useState, useEffect } from "react";
import { isAfter, addDays } from "date-fns";
import { useTrainingData } from "@/hooks/useTrainingData";
import { HR } from "@/lib/constants/collections";
import { useCollection } from "@/hooks/useCollection";
import { Event } from "./types";
import { formatDate } from "./eventDateUtils";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const { trainings, loading: loadingTrainings } = useTrainingData();
  const { getAll: getEvaluations, isLoading: loadingEvaluations } = useCollection(HR.EVALUATIONS);

  useEffect(() => {
    const fetchEvents = async () => {
      // Éviter les appels multiples
      if (hasAttemptedFetch) return;
      
      setIsLoading(true);
      setHasAttemptedFetch(true);
      
      try {
        // Get evaluations
        const evaluationsResult = await getEvaluations();
        let combinedEvents: Event[] = [];

        // Process evaluations
        if (evaluationsResult.docs) {
          const evaluationEvents = evaluationsResult.docs
            .filter(evaluation => evaluation.status === "planifiée") // Only include planned evaluations
            .filter(evaluation => {
              // Filter for upcoming evaluations (happening in the future)
              try {
                return isAfter(new Date(evaluation.date), new Date());
              } catch (e) {
                return false; // Skip invalid dates
              }
            })
            .map(evaluation => ({
              id: evaluation.id,
              title: evaluation.title || "Évaluation",
              date: formatDate(evaluation.date),
              type: 'evaluation' as const,
              description: `Évaluation de ${evaluation.employeeName || "employé"}`
            }));
          
          combinedEvents = [...combinedEvents, ...evaluationEvents];
        }

        // Process trainings
        if (trainings) {
          const trainingEvents = trainings
            .filter(training => training.status === "planifiée") // Only include planned trainings
            .filter(training => {
              // Filter for upcoming trainings
              try {
                if (!training.startDate) return false;
                return isAfter(new Date(training.startDate), new Date());
              } catch (e) {
                return false; // Skip invalid dates
              }
            })
            .map(training => ({
              id: training.id,
              title: training.title,
              date: formatDate(training.startDate || ""),
              type: 'training' as const,
              description: training.description || "Formation professionnelle"
            }));
          
          combinedEvents = [...combinedEvents, ...trainingEvents];
        }

        // Add static meetings
        combinedEvents = [...combinedEvents, ...getStaticMeetings()];
        
        // Sort by date (closest first)
        combinedEvents.sort((a, b) => {
          try {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            return dateA.getTime() - dateB.getTime();
          } catch (e) {
            return 0; // En cas d'erreur, ne pas modifier l'ordre
          }
        });
        
        // Limit to the first 4 events
        setEvents(combinedEvents.slice(0, 4));
      } catch (error) {
        console.error("Error fetching events:", error);
        // Si une erreur se produit, définir les événements statiques pour éviter un état vide
        setEvents(getStaticMeetings());
      } finally {
        setIsLoading(false);
      }
    };

    // Exécuter la requête seulement quand les dépendances sont prêtes et qu'on n'a pas déjà essayé
    if (!loadingTrainings && !loadingEvaluations && !hasAttemptedFetch) {
      fetchEvents();
    } else if (!loadingTrainings && !loadingEvaluations && hasAttemptedFetch && isLoading) {
      // Si tout est chargé mais qu'on est toujours en état de chargement, forcer la fin du chargement
      setIsLoading(false);
    }
  }, [trainings, getEvaluations, loadingTrainings, loadingEvaluations, hasAttemptedFetch, isLoading]);

  // Ajout d'un timeout pour éviter les chargements infinis
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn("Timeout dépassé pour le chargement des événements");
        setIsLoading(false);
        // En cas de timeout, afficher au moins les réunions statiques
        setEvents(getStaticMeetings());
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  return { events, isLoading };
};

// Helper function to get static meeting events
const getStaticMeetings = (): Event[] => {
  return [
    {
      id: "meeting-1",
      title: "Réunion d'équipe RH",
      date: formatDate(addDays(new Date(), 5).toISOString()),
      type: 'meeting',
      description: "Révision trimestrielle des politiques RH"
    },
    {
      id: "meeting-2",
      title: "Atelier bien-être",
      date: formatDate(addDays(new Date(), 10).toISOString()),
      type: 'other',
      description: "Gestion du stress et prévention du burnout"
    }
  ];
};
