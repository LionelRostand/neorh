
import React, { useState } from 'react';
import { Employee } from '@/types/employee';
import { useEmployeeEvaluations, Evaluation } from '@/hooks/useEmployeeEvaluations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Star, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ViewEvaluationDialog from "@/components/evaluations/ViewEvaluationDialog";

interface EmployeeEvaluationsProps {
  employee: Employee;
}

const EmployeeEvaluations: React.FC<EmployeeEvaluationsProps> = ({ employee }) => {
  // Utiliser l'ID de l'employé seulement s'il est défini
  const employeeId = employee?.id || '';
  const { evaluations, loading, error } = useEmployeeEvaluations(employeeId);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);
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

  const handleOpenEvaluation = (evaluationId: string) => {
    setSelectedEvaluationId(evaluationId);
    setIsViewDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Évaluations</h3>
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
        <h3 className="text-xl font-semibold mb-4">Évaluations</h3>
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-red-600 font-medium">Erreur lors du chargement des évaluations</p>
              <p className="text-sm text-red-500">Veuillez réessayer plus tard ou contacter l'administrateur.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Évaluations</h3>
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <Star className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500">Aucune évaluation n'est disponible pour cet employé.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Évaluations</h3>
        <Badge variant="outline" className="px-2 py-1 text-xs">
          {evaluations.length} {evaluations.length > 1 ? 'évaluations' : 'évaluation'}
        </Badge>
      </div>
      
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium">Titre</TableHead>
            <TableHead className="font-medium">Date</TableHead>
            <TableHead className="font-medium">Évaluateur</TableHead>
            <TableHead className="font-medium">Statut</TableHead>
            <TableHead className="font-medium text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluations.map((evaluation) => (
            <TableRow 
              key={evaluation.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleOpenEvaluation(evaluation.id)}
            >
              <TableCell>{evaluation.title}</TableCell>
              <TableCell>{evaluation.date}</TableCell>
              <TableCell>{evaluation.evaluator}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeClass(evaluation.status)}>
                  {evaluation.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Empêcher le déclenchement du onClick de la ligne
                    handleOpenEvaluation(evaluation.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" /> Voir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <ViewEvaluationDialog 
        evaluationId={selectedEvaluationId}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        evaluations={evaluations}
      />
    </div>
  );
};

export default EmployeeEvaluations;
