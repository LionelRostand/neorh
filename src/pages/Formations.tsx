
import React, { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon, FilterIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import TrainingStatusCards from "@/components/training/TrainingStatusCards";
import TrainingTable from "@/components/training/TrainingTable";

interface Training {
  id: string;
  title: string;
  description: string;
  trainer: string;
  department: string;
  participants: number;
  status: "planifiée" | "complétée" | "annulée";
}

const mockTrainings: Training[] = [
  {
    id: "8a7d6215b-9c5c-4247-bc8c-5d8ce3313e7e",
    title: "Formation Excel Avancé",
    description: "Maîtriser les tableaux croisés dynamiques",
    trainer: "Marie Dubois",
    department: "Administration",
    participants: 12,
    status: "planifiée"
  }
];

const Formations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [trainings] = useState<Training[]>(mockTrainings);

  const handleNewTraining = () => {
    toast({
      title: "Nouvelle formation",
      description: "Fonctionnalité à implémenter",
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Suppression",
      description: `Suppression de la formation ${id}`,
    });
  };

  const handleModify = (id: string) => {
    toast({
      title: "Modification",
      description: `Modification de la formation ${id}`,
    });
  };

  const handleManage = (id: string) => {
    toast({
      title: "Gestion",
      description: `Gestion des participants pour la formation ${id}`,
    });
  };

  // Count trainings by status
  const active = trainings.filter(t => t.status === "planifiée").length;
  const pending = trainings.filter(t => t.status === "complétée").length;
  const expired = trainings.filter(t => t.status === "annulée").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des formations</h1>
        <div>
          <Button onClick={handleNewTraining} className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouveau
          </Button>
        </div>
      </div>

      <TrainingStatusCards 
        active={active} 
        pending={pending} 
        expired={expired} 
        coverage={85} 
      />

      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Liste des formations</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  <SelectItem value="administration">Administration</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="ventes">Ventes</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="planifiée">Planifiée</SelectItem>
                  <SelectItem value="complétée">Complétée</SelectItem>
                  <SelectItem value="annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TrainingTable 
            trainings={trainings}
            onDelete={handleDelete}
            onModify={handleModify}
            onManage={handleManage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Formations;
