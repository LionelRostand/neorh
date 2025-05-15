
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

interface Evaluation {
  id: string;
  employee: string;
  title: string;
  date: string;
  evaluator: string;
  status: "planifiée" | "complétée" | "annulée";
}

interface EvaluationTableProps {
  evaluations: Evaluation[];
  onDelete: (id: string) => void;
  onModify: (id: string) => void;
  onManage: (id: string) => void;
}

const EvaluationTable = ({ evaluations, onDelete, onModify, onManage }: EvaluationTableProps) => {
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

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium">ID</TableHead>
            <TableHead className="font-medium">Nom</TableHead>
            <TableHead className="font-medium">Description</TableHead>
            <TableHead className="font-medium">Manager</TableHead>
            <TableHead className="font-medium">Employés</TableHead>
            <TableHead className="text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluations.map((evaluation) => (
            <TableRow key={evaluation.id}>
              <TableCell className="font-mono text-xs">{evaluation.id}</TableCell>
              <TableCell>{evaluation.title}</TableCell>
              <TableCell>{evaluation.evaluator}</TableCell>
              <TableCell>{evaluation.employee}</TableCell>
              <TableCell>0</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onModify(evaluation.id)}
                  >
                    <Edit className="h-4 w-4" /> Modifier
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(evaluation.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Supprimer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManage(evaluation.id)}
                  >
                    <Users className="h-4 w-4" /> Gérer
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
