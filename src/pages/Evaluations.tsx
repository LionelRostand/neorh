
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Évaluations des employés</h1>
        <div className="flex space-x-2">
          <Button onClick={handleNewEvaluation} className="bg-emerald-600 hover:bg-emerald-700">
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
        <Card className="border shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{planned}</span>
            <span className="text-gray-500">Planifiées</span>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{completed}</span>
            <span className="text-gray-500">Complétées</span>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{cancelled}</span>
            <span className="text-gray-500">Annulées</span>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-sm">
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
                <FileTextIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium">Employé</TableHead>
                <TableHead className="font-medium">Titre</TableHead>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Évaluateur</TableHead>
                <TableHead className="font-medium">Statut</TableHead>
                <TableHead className="text-right font-medium">Actions</TableHead>
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
                    <Badge className={getStatusBadgeClass(evaluation.status)}>
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
