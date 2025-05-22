
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface PostDetailsCardProps {
  description: string;
  requirements?: string[];
  onDescriptionSave: (description: string) => Promise<void>;
}

const PostDetailsCard: React.FC<PostDetailsCardProps> = ({
  description,
  requirements,
  onDescriptionSave,
}) => {
  const [localDescription, setLocalDescription] = useState<string>(description);
  const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalDescription(e.target.value);
  };

  const handleDescriptionSave = async () => {
    try {
      setIsUpdatingDescription(true);
      await onDescriptionSave(localDescription);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la description:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la description"
      });
    } finally {
      setIsUpdatingDescription(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails du poste</CardTitle>
        <CardDescription>Informations sur l'offre d'emploi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <Textarea 
            value={localDescription} 
            onChange={handleDescriptionChange}
            className="w-full min-h-[100px]"
            placeholder="Ajoutez une description pour ce poste..."
          />
          <div className="flex justify-end mt-2">
            <Button 
              size="sm" 
              onClick={handleDescriptionSave}
              disabled={isUpdatingDescription}
            >
              {isUpdatingDescription ? "Enregistrement..." : "Enregistrer"}
            </Button>
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
