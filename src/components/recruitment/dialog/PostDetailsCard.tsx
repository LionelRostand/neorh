
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface PostDetailsCardProps {
  description: string;
  requirements?: string[];
}

const PostDetailsCard: React.FC<PostDetailsCardProps> = ({
  description,
  requirements,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails du poste</CardTitle>
        <CardDescription>Informations sur l'offre d'emploi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <div className="text-sm text-gray-600 whitespace-pre-wrap">
            {description || "Aucune description disponible pour ce poste."}
          </div>
        </div>

        {requirements && requirements.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Prérequis</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostDetailsCard;
