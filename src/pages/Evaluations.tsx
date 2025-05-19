
import React, { useState, useEffect, useCallback } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon, FilterIcon, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import EvaluationStatusCards from "@/components/evaluations/EvaluationStatusCards";
import EvaluationTable from "@/components/evaluations/EvaluationTable";
import { useFirestore } from "@/hooks/useFirestore";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { Evaluation } from "@/hooks/useEmployeeEvaluations";

const Evaluations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const { search, getAll } = useFirestore<Evaluation>('hr_evaluations');
  const { employees } = useEmployeeData();

  // Fonction pour récupérer les évaluations
  const fetchEvaluations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAll();
      if (result.docs) {
        setEvaluations(result.docs);
      } else {
        setEvaluations([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des évaluations:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les évaluations"
      });
    } finally {
      setLoading(false);
    }
  }, [getAll]);

  // Charger les évaluations au chargement de la page
  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

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
  const statusCounts = {
    planifiée: evaluations.filter(e => e.status === "planifiée").length,
    complétée: evaluations.filter(e => e.status === "complétée").length,
    annulée: evaluations.filter(e => e.status === "annulée").length,
    total: evaluations.length
  };

  // Calcul du taux de couverture (employés qui ont au moins une évaluation)
  const employeeWithEvalCount = new Set(evaluations.map(e => e.employeeId)).size;
  const coverageRate = employees?.length 
    ? Math.round((employeeWithEvalCount / employees.length) * 100) 
    : 0;

  // Filtrer les évaluations
  const filteredEvaluations = evaluations.filter(evaluation => {
    // Filtre par recherche
    const matchesSearch = 
      evaluation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.evaluator?.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filtre par statut
    const matchesStatus = selectedStatus === 'all' || evaluation.status === selectedStatus;
    
    // Filtre par employé
    const matchesEmployee = selectedEmployee === 'all' || evaluation.employeeId === selectedEmployee;
    
    return matchesSearch && matchesStatus && matchesEmployee;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des évaluations</h1>
          <p className="text-muted-foreground">Gérez les évaluations des employés</p>
        </div>
        <div>
          <Button onClick={handleNewEvaluation} className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouvelle évaluation
          </Button>
        </div>
      </div>

      <EvaluationStatusCards 
        active={statusCounts.planifiée} 
        pending={statusCounts.complétée} 
        expired={statusCounts.annulée} 
        coverage={coverageRate} 
      />

      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Liste des évaluations</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchEvaluations}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Rafraîchir
            </Button>
          </div>
          
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
              <Select 
                value={selectedEmployee} 
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Tous les employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  {employees?.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={selectedStatus} 
                onValueChange={setSelectedStatus}
              >
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
            evaluations={filteredEvaluations}
            loading={loading}
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
