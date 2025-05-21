
import React, { useState } from 'react';
import { useEmployeeTrainings, Training } from '@/hooks/useTrainingData';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import ViewTrainingDialog from '@/components/training/ViewTrainingDialog';
import { Skeleton } from '@/components/ui/skeleton';

interface EmployeeTrainingsProps {
  employee: Employee;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planifiée':
      return 'bg-blue-100 text-blue-800';
    case 'complétée':
      return 'bg-green-100 text-green-800';
    case 'annulée':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const EmployeeTrainings: React.FC<EmployeeTrainingsProps> = ({ employee }) => {
  const { trainings, loading, error } = useEmployeeTrainings(employee.id);
  const [selectedTraining, setSelectedTraining] = useState<Training | undefined>();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewTraining = (training: Training) => {
    setSelectedTraining(training);
    setIsViewDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-800">Une erreur est survenue lors du chargement des formations.</p>
        </CardContent>
      </Card>
    );
  }

  if (trainings.length === 0) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Aucune formation enregistrée pour cet employé.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Formations ({trainings.length})</h3>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Intitulé</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Formateur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell>{training.title}</TableCell>
                <TableCell>{training.type || 'Non spécifié'}</TableCell>
                <TableCell>{training.trainer || 'Interne'}</TableCell>
                <TableCell>
                  {training.startDate ? format(new Date(training.startDate), 'dd/MM/yyyy', { locale: fr }) : '–'}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(training.status)}>
                    {training.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewTraining(training)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ViewTrainingDialog 
        open={isViewDialogOpen} 
        onOpenChange={setIsViewDialogOpen} 
        training={selectedTraining} 
      />
    </div>
  );
};

export default EmployeeTrainings;
