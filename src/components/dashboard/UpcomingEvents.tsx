
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck2, Users, Award, GraduationCap } from "lucide-react";
import { useTrainingData } from "@/hooks/useTrainingData";
import { HR } from "@/lib/constants/collections";
import { useCollection } from "@/hooks/useCollection";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isAfter, addDays, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'meeting' | 'training' | 'evaluation' | 'other';
  description: string;
}

const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { trainings, loading: loadingTrainings } = useTrainingData();
  const { getAll: getEvaluations, isLoading: loadingEvaluations } = useCollection(HR.EVALUATIONS);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
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

        // Add a few meetings (static data)
        const staticMeetings: Event[] = [
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
        
        combinedEvents = [...combinedEvents, ...staticMeetings];
        
        // Sort by date (closest first)
        combinedEvents.sort((a, b) => {
          const dateA = parseDate(a.date);
          const dateB = parseDate(b.date);
          
          return dateA.getTime() - dateB.getTime();
        });
        
        // Limit to the first 4 events
        setEvents(combinedEvents.slice(0, 4));
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loadingTrainings && !loadingEvaluations) {
      fetchEvents();
    }
  }, [trainings, getEvaluations, loadingTrainings, loadingEvaluations]);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const parseDate = (formattedDate: string): Date => {
    try {
      // Try to parse the date from the French format
      const parts = formattedDate.split(' ');
      const day = parseInt(parts[0], 10);
      const month = getMonthNumber(parts[1]);
      const year = parseInt(parts[2], 10);
      
      return new Date(year, month, day);
    } catch (e) {
      return new Date(); // Fallback to current date
    }
  };

  const getMonthNumber = (monthName: string): number => {
    const months = {
      'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3,
      'mai': 4, 'juin': 5, 'juillet': 6, 'août': 7,
      'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
    };
    
    return months[monthName.toLowerCase() as keyof typeof months] || 0;
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'training':
        return <GraduationCap className="h-5 w-5 text-green-500" />;
      case 'evaluation':
        return <Award className="h-5 w-5 text-purple-500" />;
      default:
        return <CalendarCheck2 className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Événements à venir</CardTitle>
          <CardDescription>Calendrier des événements RH importants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex space-x-3 border-b pb-3 last:border-0">
                <Skeleton className="h-5 w-5 mt-0.5" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Événements à venir</CardTitle>
        <CardDescription>Calendrier des événements RH importants</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <ul className="space-y-4">
            {events.map(event => (
              <li key={event.id} className="flex space-x-3 border-b pb-3 last:border-0">
                <div className="mt-0.5">
                  {getEventIcon(event.type)}
                </div>
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-500">{event.description}</p>
                  <p className="text-xs font-medium text-blue-600 mt-1">{event.date}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <CalendarCheck2 className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500">Aucun événement à venir</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
