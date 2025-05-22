
import React, { useState } from "react";
import {
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, Users } from "lucide-react";
import { Training } from "@/hooks/useTrainingData";
import ViewTrainingDialog from "./ViewTrainingDialog";
import EditTrainingDialog from "./EditTrainingDialog";
import DeleteTrainingDialog from "./DeleteTrainingDialog";

interface TrainingTableProps {
  trainings: Training[];
  onRefresh: () => void;
}

const TrainingTable = ({ trainings, onRefresh }: TrainingTableProps) => {
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleView = (training: Training) => {
    setSelectedTraining(training);
    setViewDialogOpen(true);
  };

  const handleEdit = (training: Training) => {
    setSelectedTraining(training);
    setEditDialogOpen(true);
  };

  const handleDelete = (training: Training) => {
    setSelectedTraining(training);
    setDeleteDialogOpen(true);
  };

  const handleManage = (id: string) => {
    // Placeholder for future implementation
    console.log("Manage participants for training:", id);
  };

  return (
    <>
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
                <TableCell>{training.trainer || training.organization || "Interne"}</TableCell>
                <TableCell>{training.department || "Non spécifié"}</TableCell>
                <TableCell>{training.participants || 1}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(training)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(training)}
                    >
                      <Edit className="h-4 w-4" /> Modifier
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(training)}
                    >
                      <Trash2 className="h-4 w-4" /> Supprimer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManage(training.id)}
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

      {selectedTraining && (
        <>
          <ViewTrainingDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            training={selectedTraining}
          />
          
          <EditTrainingDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            training={selectedTraining}
            onSuccess={onRefresh}
          />

          <DeleteTrainingDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            trainingId={selectedTraining.id}
            onSuccess={onRefresh}
          />
        </>
      )}
    </>
  );
};

export default TrainingTable;
