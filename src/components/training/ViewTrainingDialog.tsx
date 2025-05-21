
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays, MapPin, User, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Training } from "@/hooks/useTrainingData";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  planifiée: "bg-blue-100 text-blue-800",
  complétée: "bg-green-100 text-green-800",
  annulée: "bg-red-100 text-red-800",
};

interface ViewTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  training?: Training;
}

const ViewTrainingDialog = ({
  open,
  onOpenChange,
  training,
}: ViewTrainingDialogProps) => {
  if (!training) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{training.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge
              className={
                training.status
                  ? statusColors[training.status as keyof typeof statusColors]
                  : "bg-gray-100 text-gray-800"
              }
            >
              {training.status || "Statut inconnu"}
            </Badge>
            {training.type && (
              <Badge className="bg-purple-100 text-purple-800">
                {training.type}
              </Badge>
            )}
          </div>

          <div className="grid gap-3">
            {training.description && (
              <Card className="bg-gray-50 border-gray-100">
                <CardContent className="p-4">
                  <p className="text-gray-700">{training.description}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CalendarDays className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Dates</p>
                  <p className="text-gray-600">
                    {training.startDate
                      ? format(new Date(training.startDate), "dd MMMM yyyy", {
                          locale: fr,
                        })
                      : "Non spécifié"}
                    {training.endDate &&
                      ` - ${format(new Date(training.endDate), "dd MMMM yyyy", {
                        locale: fr,
                      })}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Formateur</p>
                  <p className="text-gray-600">{training.trainer || "Non spécifié"}</p>
                </div>
              </div>

              {training.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Lieu</p>
                    <p className="text-gray-600">{training.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Département</p>
                  <p className="text-gray-600">{training.department || "Non spécifié"}</p>
                </div>
              </div>
            </div>

            {training.employeeName && (
              <div className="pt-2">
                <h3 className="text-sm font-semibold mb-2">Participant</h3>
                <div className="bg-blue-50 text-blue-700 inline-block text-sm px-2 py-1 rounded-md">
                  {training.employeeName}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTrainingDialog;
