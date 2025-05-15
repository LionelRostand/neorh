
import React from 'react';
import { Employee } from '@/types/employee';
import { useEmployeeEvaluations, Evaluation } from '@/hooks/useEmployeeEvaluations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EmployeeEvaluationsProps {
  employee: Employee;
}

const EmployeeEvaluations: React.FC<EmployeeEvaluationsProps> = ({ employee }) => {
  const { evaluations, loading, error } = useEmployeeEvaluations(employee.id);
  
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
        <p className="text-red-500">Erreur lors du chargement des évaluations.</p>
      </div>
    );
  }

  if (evaluations.length === 0) {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluations.map((evaluation) => (
            <TableRow key={evaluation.id}>
              <TableCell>{evaluation.title}</TableCell>
              <TableCell>{evaluation.date}</TableCell>
              <TableCell>{evaluation.evaluator}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeClass(evaluation.status)}>
                  {evaluation.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeEvaluations;
