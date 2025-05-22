
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MapPin, Users, Briefcase, Clock } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Department } from "@/types/firebase";

interface PostInfoCardProps {
  title: string;
  location?: string;
  createdAt: string;
  applications?: number;
  departmentId: string;
  departments?: Department[];
}

const PostInfoCard: React.FC<PostInfoCardProps> = ({
  title,
  location,
  createdAt,
  applications = 0,
  departmentId,
  departments = [],
}) => {
  const createdDate = new Date(createdAt);
  const formattedDate = format(createdDate, 'dd MMMM yyyy', { locale: fr });

  // Récupérer le nom du département à partir de son ID
  const departmentName = departments?.find(dept => dept.id === departmentId)?.name || "Département inconnu";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500">Département:</span>
            <span>{departmentName}</span>
          </li>
          {location && (
            <li className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">Lieu:</span>
              <span>{location}</span>
            </li>
          )}
          <li className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500">Créé le:</span>
            <span>{formattedDate}</span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500">Candidatures:</span>
            <span>{applications}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default PostInfoCard;
