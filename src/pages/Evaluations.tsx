
import React, { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  DownloadIcon, 
  PlusIcon, 
  SearchIcon, 
  FileTextIcon, 
  FilterIcon 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

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
    id: "1",
    employee: "Lionel DJOSSA",
    title: "TEST",
    date: "03 mai 2025",
    evaluator: "Lionel DJOSSA",
    status: "planifiée"
  },
  {
    id: "2",
    employee: "Employé inconnu",
    title: "Évaluation",
    date: "15 mai 2025",
    evaluator: "Non assigné",
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

  const handleExport = () => {
    toast({
      title: "Export des évaluations",
      description: "Fonctionnalité à implémenter",
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Suppression",
      description: `Suppression de l'évaluation ${id}`,
    });
  };

  // Count evaluations by status
  const planned = evaluations.filter(e => e.status === "planifiée").length;
  const completed = evaluations.filter(e => e.status === "complétée").length;
  const cancelled = evaluations.filter(e => e.status === "annulée").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Évaluations des employés</h1>
        <div className="flex space-x-2">
          <Button onClick={handleNewEvaluation} className="bg-green-600 hover:bg-green-700">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouvelle évaluation
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{planned}</span>
            <span className="text-gray-500">Planifiées</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{completed}</span>
            <span className="text-gray-500">Complétées</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{cancelled}</span>
            <span className="text-gray-500">Annulées</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Évaluations</h2>
          
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
              <Button variant="outline" className="w-52">
                Tous les employés
                <FilterIcon className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-44">
                Tous les statuts
                <FilterIcon className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <FileTextIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Évaluateur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>{evaluation.employee}</TableCell>
                  <TableCell>{evaluation.title}</TableCell>
                  <TableCell>{evaluation.date}</TableCell>
                  <TableCell>{evaluation.evaluator}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-600 text-white">
                      Planifiée
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleDelete(evaluation.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evaluations;
