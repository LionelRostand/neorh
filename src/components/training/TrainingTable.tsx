
import React from "react";
import {
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Users } from "lucide-react";

interface Training {
  id: string;
  title: string;
  description: string;
  trainer: string;
  department: string;
  participants: number;
  status: "planifiée" | "complétée" | "annulée";
}

interface TrainingTableProps {
  trainings: Training[];
  onDelete: (id: string) => void;
  onModify: (id: string) => void;
  onManage: (id: string) => void;
}

const TrainingTable = ({ trainings, onDelete, onModify, onManage }: TrainingTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium">ID</TableHead>
            <TableHead className="font-medium">Nom</TableHead>
            <TableHead className="font-medium">Description</TableHead>
            <TableHead className="font-medium">Formateur</TableHead>
            <TableHead className="font-medium">Département</TableHead>
            <TableHead className="font-medium">Participants</TableHead>
            <TableHead className="text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainings.map((training) => (
            <TableRow key={training.id}>
              <TableCell className="font-mono text-xs">{training.id}</TableCell>
              <TableCell>{training.title}</TableCell>
              <TableCell>{training.description}</TableCell>
              <TableCell>{training.trainer}</TableCell>
              <TableCell>{training.department}</TableCell>
              <TableCell>{training.participants}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onModify(training.id)}
                  >
                    <Edit className="h-4 w-4" /> Modifier
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(training.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Supprimer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManage(training.id)}
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

export default TrainingTable;
