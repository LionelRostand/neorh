
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Briefcase, Clock } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RecruitmentPost } from "@/types/recruitment";
import { Textarea } from "@/components/ui/textarea";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";

interface ViewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: RecruitmentPost | null;
  onStatusChange: (postId: string, status: string) => void;
  onConvertToEmployee: (post: RecruitmentPost) => void;
  isConverting: boolean;
}

const ViewPostDialog: React.FC<ViewPostDialogProps> = ({
  open,
  onOpenChange,
  post,
  onStatusChange,
  onConvertToEmployee,
  isConverting
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);
  const { departments } = useDepartmentsData();

  useEffect(() => {
    if (post) {
      setDescription(post.description || "");
    }
  }, [post]);

  if (!post) return null;

  const createdDate = new Date(post.createdAt);
  const formattedDate = format(createdDate, 'dd MMMM yyyy', { locale: fr });

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onStatusChange(post.id, status);
  };

  const handleConvertToEmployee = () => {
    onConvertToEmployee(post);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleDescriptionSave = async () => {
    if (!post) return;

    try {
      setIsUpdatingDescription(true);
      const postRef = doc(db, 'hr_recruitment', post.id);
      await updateDoc(postRef, {
        description: description
      });
      
      toast({
        title: "Description mise à jour",
        description: "La description a été enregistrée avec succès"
      });
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

  // Récupérer le nom du département à partir de son ID
  const departmentName = departments.find(dept => dept.id === post.department)?.name || post.department;

  const statusOptions = [
    { value: 'ouverte', label: 'Ouverte', color: 'bg-blue-100 text-blue-800' },
    { value: 'en_cours', label: 'En cours', color: 'bg-amber-100 text-amber-800' },
    { value: 'entretiens', label: 'Entretiens', color: 'bg-purple-100 text-purple-800' },
    { value: 'offre', label: 'Offre', color: 'bg-green-100 text-green-800' },
    { value: 'fermée', label: 'Fermée', color: 'bg-gray-100 text-gray-800' }
  ];

  const currentStatusOption = statusOptions.find(option => option.value === post.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{post.title}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={currentStatusOption?.color}>
              {currentStatusOption?.label}
            </Badge>
            {post.contractType && <Badge variant="outline">{post.contractType}</Badge>}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Détails du poste</CardTitle>
                <CardDescription>Informations sur l'offre d'emploi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <Textarea 
                    value={description} 
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

                {post.requirements && post.requirements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Prérequis</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {post.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {post.candidateName && (
              <Card>
                <CardHeader>
                  <CardTitle>Candidat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">{post.candidateName}</p>
                  {post.nextStep && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Prochaine étape:</span> {post.nextStep}
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleConvertToEmployee}
                    disabled={isConverting || post.status !== 'offre'}
                  >
                    {isConverting ? "Conversion..." : "Convertir en employé"}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>

          <div className="space-y-4">
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
                  {post.location && (
                    <li className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500">Lieu:</span>
                      <span>{post.location}</span>
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
                    <span>{post.applications || 0}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changer le statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {statusOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={post.status === option.value ? "default" : "outline"}
                      className={post.status === option.value ? "" : "justify-start"}
                      onClick={() => handleStatusChange(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPostDialog;
