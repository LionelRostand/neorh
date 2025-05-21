
import React, { useState } from 'react';
import { Employee } from '@/types/employee';
import { useEmployeeTrainings, Training } from '@/hooks/useTrainingData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BookOpen, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ViewTrainingDialog from "@/components/training/ViewTrainingDialog";

interface EmployeeTrainingsProps {
  employee: Employee;
}

const EmployeeTrainings: React.FC<EmployeeTrainingsProps> = ({ employee }) => {
  const employeeId = employee?.id || '';
  const { trainings, loading, error } = useEmployeeTrainings(employeeId);
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "planifiée":
        return "bg-emerald-600 hover:bg-emerald-700";
      case "complétée":
        return "bg-blue-600 hover:bg-blue-700";
      case "annulée":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const handleOpenTraining = (trainingId: string) => {
    setSelectedTrainingId(trainingId);
    setIsViewDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Formations</h3>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Formations</h3>
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-red-600 font-medium">Erreur lors du chargement des formations</p>
              <p className="text-sm text-red-500">Veuillez réessayer plus tard ou contacter l'administrateur.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!trainings || trainings.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Formations</h3>
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <BookOpen className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500">Aucune formation n'est disponible pour cet employé.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Formations</h3>
        <Badge variant="outline" className="px-2 py-1 text-xs">
          {trainings.length} {trainings.length > 1 ? 'formations' : 'formation'}
        </Badge>
      </div>
      
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium">Titre</TableHead>
            <TableHead className="font-medium">Description</TableHead>
            <TableHead className="font-medium">Formateur</TableHead>
            <TableHead className="font-medium">Statut</TableHead>
            <TableHead className="font-medium text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainings.map((training) => (
            <TableRow 
              key={training.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleOpenTraining(training.id)}
            >
              <TableCell>{training.title}</TableCell>
              <TableCell>{training.description}</TableCell>
              <TableCell>{training.trainer}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeClass(training.status)}>
                  {training.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Empêcher le déclenchement du onClick de la ligne
                    handleOpenTraining(training.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" /> Voir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <ViewTrainingDialog 
        trainingId={selectedTrainingId}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        trainings={trainings}
      />
    </div>
  );
};

export default EmployeeTrainings;
