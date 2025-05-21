
import { useState, useCallback, useEffect } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import { Evaluation } from "@/hooks/useEmployeeEvaluations";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { toast } from "@/components/ui/use-toast";

export const useEvaluationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAll } = useFirestore<Evaluation>('hr_evaluations');
  const { employees } = useEmployeeData();

  // Fonction pour récupérer les évaluations
  const fetchEvaluations = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching evaluations...");
      const result = await getAll();
      if (result.docs && result.docs.length > 0) {
        console.log(`Retrieved ${result.docs.length} evaluations`, result.docs);
        setEvaluations(result.docs);
      } else {
        console.log("No evaluations found or empty result");
        setEvaluations([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des évaluations:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les évaluations"
      });
      // Assurer que l'état est toujours défini même en cas d'erreur
      setEvaluations([]);
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

  return {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedEmployee,
    setSelectedEmployee,
    evaluations,
    filteredEvaluations,
    loading,
    fetchEvaluations,
    handleNewEvaluation,
    handleDelete,
    handleModify,
    handleManage,
    statusCounts,
    coverageRate,
    employees
  };
};
