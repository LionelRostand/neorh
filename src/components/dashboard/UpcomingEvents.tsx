
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck2, Users, Award, GraduationCap } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
  type: 'meeting' | 'training' | 'evaluation' | 'other';
  description: string;
}

const UpcomingEvents = () => {
  // Données d'exemple pour les événements
  const events: Event[] = [
    {
      id: 1,
      title: "Réunion d'équipe RH",
      date: "15 Mai 2025",
      type: "meeting",
      description: "Révision trimestrielle des politiques RH"
    },
    {
      id: 2,
      title: "Formation RGPD",
      date: "18 Mai 2025",
      type: "training",
      description: "Session obligatoire pour tous les managers"
    },
    {
      id: 3,
      title: "Évaluations annuelles",
      date: "22 Mai 2025",
      type: "evaluation",
      description: "Début de la période d'évaluation"
    },
    {
      id: 4,
      title: "Atelier bien-être",
      date: "25 Mai 2025",
      type: "other",
      description: "Gestion du stress et prévention du burnout"
    }
  ];

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Événements à venir</CardTitle>
        <CardDescription>Calendrier des événements RH importants</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
