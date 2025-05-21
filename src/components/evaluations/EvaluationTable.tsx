
import React from "react";
import {
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Users } from "lucide-react";
import { Evaluation } from "@/hooks/useEmployeeEvaluations";

interface EvaluationTableProps {
  evaluations: Evaluation[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onModify: (id: string) => void;
  onManage: (id: string) => void;
  employees?: { id: string; name: string }[] | null;
  showEmployeeColumn?: boolean;
}

const EvaluationTable = ({ 
  evaluations, 
  loading, 
  onDelete, 
  onModify, 
  onManage,
  employees = null,
  showEmployeeColumn = false
}: EvaluationTableProps) => {
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

  const getEmployeeName = (employeeId: string) => {
    if (!employees) return employeeId;
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : employeeId;
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Afficher un message explicite lorsqu'il n'y a aucune évaluation
  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-gray-500">Aucune évaluation trouvée</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium">Titre</TableHead>
            {showEmployeeColumn && (
              <TableHead className="font-medium">Employé</TableHead>
            )}
            <TableHead className="font-medium">Date</TableHead>
            <TableHead className="font-medium">Évaluateur</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluations.map((evaluation) => (
            <TableRow key={evaluation.id}>
              <TableCell>{evaluation.title}</TableCell>
              {showEmployeeColumn && (
                <TableCell>{getEmployeeName(evaluation.employeeId)}</TableCell>
              )}
              <TableCell>{evaluation.date}</TableCell>
              <TableCell>{evaluation.evaluator}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeClass(evaluation.status)}>
                  {evaluation.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onModify(evaluation.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Modifier
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(evaluation.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManage(evaluation.id)}
                  >
                    <Users className="h-4 w-4 mr-1" /> Gérer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EvaluationTable;
