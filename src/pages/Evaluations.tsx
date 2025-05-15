
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
import EvaluationStatusCards from "@/components/evaluations/EvaluationStatusCards";
import EvaluationTable from "@/components/evaluations/EvaluationTable";

interface Evaluation {
  id: string;
  employee: string;
  title: string;
  date: string;
  evaluator: string;
  status: "planifiée" | "complétée" | "annulée";
}

const mockEvaluations: Evaluation[] = [
  {
    id: "95d6215b-8b5c-4247-ad8c-6b8ce3313e7e",
    employee: "Lionel DJOSSA",
    title: "DIRECTION GENERALE",
    date: "03 mai 2025",
    evaluator: "gérer par le PDG",
    status: "planifiée"
  }
];

const Evaluations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [evaluations] = useState<Evaluation[]>(mockEvaluations);

  const handleNewEvaluation = () => {
    toast({
      title: "Nouvelle évaluation",
      description: "Fonctionnalité à implémenter",
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Suppression",
      description: `Suppression de l'évaluation ${id}`,
    });
  };

  const handleModify = (id: string) => {
    toast({
      title: "Modification",
      description: `Modification de l'évaluation ${id}`,
    });
  };

  const handleManage = (id: string) => {
    toast({
      title: "Gestion",
      description: `Gestion de l'évaluation ${id}`,
    });
  };

  // Count evaluations by status
  const active = evaluations.filter(e => e.status === "planifiée").length;
  const pending = evaluations.filter(e => e.status === "complétée").length;
  const expired = evaluations.filter(e => e.status === "annulée").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des évaluations</h1>
        <div>
          <Button onClick={handleNewEvaluation} className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouveau
          </Button>
        </div>
      </div>

      <EvaluationStatusCards 
        active={active} 
        pending={pending} 
        expired={expired} 
        coverage={100} 
      />

      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Liste des évaluations</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher une évaluation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Tous les employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
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

          <EvaluationTable 
            evaluations={evaluations}
            onDelete={handleDelete}
            onModify={handleModify}
            onManage={handleManage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Evaluations;
