
import React, { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon, FilterIcon, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import TrainingStatusCards from "@/components/training/TrainingStatusCards";
import TrainingTable from "@/components/training/TrainingTable";
import { useTrainingData } from "@/hooks/useTrainingData";
import { Skeleton } from "@/components/ui/skeleton";

const Formations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { trainings, loading, error, refetch } = useTrainingData();
  
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

  // Filtrer les formations en fonction des critères de recherche avec vérification pour les valeurs undefined
  const filteredTrainings = trainings
    .filter(training => 
      (training.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      training.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      training.trainer?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false
    )
    .filter(training => selectedDepartment === "all" || training.department === selectedDepartment)
    .filter(training => selectedStatus === "all" || training.status === selectedStatus);

  // Count trainings by status
  const active = trainings.filter(t => t.status === "planifiée").length;
  const pending = trainings.filter(t => t.status === "complétée").length;
  const expired = trainings.filter(t => t.status === "annulée").length;
  
  // Calculate coverage (example metric - could be replaced with actual calculation)
  const coverage = trainings.length > 0 ? Math.round((active + pending) * 100 / trainings.length) : 0;

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
        coverage={coverage} 
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
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Ventes">Ventes</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
              
              <Button variant="outline" size="icon" onClick={() => refetch()}>
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2 py-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <Card className="border border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-red-600 font-medium">Erreur lors du chargement des formations</p>
                  <p className="text-sm text-red-500">Veuillez réessayer plus tard ou contacter l'administrateur.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <TrainingTable 
              trainings={filteredTrainings}
              onDelete={handleDelete}
              onModify={handleModify}
              onManage={handleManage}
            />
          )}
          
          {filteredTrainings.length === 0 && !loading && !error && (
            <div className="text-center p-8">
              <BookOpen className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500">Aucune formation ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Formations;
