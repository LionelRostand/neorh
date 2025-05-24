
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

  console.log('PostInfoCard - departmentId:', departmentId);
  console.log('PostInfoCard - departments:', departments);

  // Logique améliorée de récupération du nom du département
  const getDepartmentName = () => {
    if (!departmentId) {
      return "Département non défini";
    }
    
    if (!departments || departments.length === 0) {
      console.log('PostInfoCard - no departments loaded yet');
      return "Chargement...";
    }
    
    // Recherche exacte par ID
    const department = departments.find(dept => dept.id === departmentId);
    if (department?.name) {
      console.log('PostInfoCard - found exact match:', department);
      return department.name;
    }
    
    // Recherche par nom si l'ID ne correspond pas (fallback)
    const departmentByName = departments.find(dept => dept.name === departmentId);
    if (departmentByName?.name) {
      console.log('PostInfoCard - found by name:', departmentByName);
      return departmentByName.name;
    }
    
    // Si aucun département trouvé, afficher l'ID comme nom temporaire
    console.log('PostInfoCard - no department found, using ID as fallback:', departmentId);
    return departmentId;
  };
  
  const departmentName = getDepartmentName();
  console.log('PostInfoCard - final departmentName:', departmentName);

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
            <span className="font-medium">{departmentName}</span>
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
