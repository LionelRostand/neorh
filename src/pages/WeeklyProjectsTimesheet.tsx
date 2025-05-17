
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, parseISO, differenceInCalendarDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Save, X, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useFirestore } from '@/hooks/firestore';
import { Timesheet } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
  id: string;
  name: string;
}

interface WeeklyData {
  week: number;
  startDate: string;
  endDate: string;
  projects: WeeklyProjectTime[];
}

interface WeeklyProjectTime {
  projectId: string;
  days: number;
}

const mockProjects: Project[] = [
  { id: 'PROJ-001', name: 'Développement Frontend' },
  { id: 'PROJ-002', name: 'Base de données' },
  { id: 'PROJ-003', name: 'Migration ERP' },
  { id: 'PROJ-004', name: 'Support Technique' },
  { id: 'PROJ-005', name: 'Formation' },
];

const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const WeeklyProjectsTimesheet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [projects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const timesheetCollection = useFirestore<Timesheet>('hr_timesheet');

  // Fetch the timesheet data
  const fetchTimesheet = async () => {
    if (!id) {
      setError(new Error("ID de feuille de temps non fourni"));
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching timesheet with ID:", id);
      const result = await timesheetCollection.getById(id);
      
      if (!result) {
        throw new Error("Feuille de temps non trouvée");
      }
      
      console.log("Timesheet data received:", result);
      setTimesheet(result);
      
      // Generate weekly data based on the timesheet period
      if (result.weekStartDate && result.weekEndDate) {
        const start = parseISO(result.weekStartDate);
        const end = parseISO(result.weekEndDate);
        const daysInPeriod = differenceInCalendarDays(end, start) + 1;
        const numberOfWeeks = Math.ceil(daysInPeriod / 7);
        
        console.log(`Period spans ${daysInPeriod} days and ${numberOfWeeks} weeks`);
        
        const weeks: WeeklyData[] = [];
        for (let i = 0; i < numberOfWeeks; i++) {
          const weekStartDate = addDays(start, i * 7);
          const weekEndDate = i === numberOfWeeks - 1 ? end : addDays(weekStartDate, 6);
          
          weeks.push({
            week: getWeekNumber(weekStartDate),
            startDate: format(weekStartDate, 'yyyy-MM-dd'),
            endDate: format(weekEndDate, 'yyyy-MM-dd'),
            projects: result.weeklyProjects && result.weeklyProjects[i] 
              ? result.weeklyProjects[i].projects 
              : []
          });
        }
        
        setWeeklyData(weeks);
        if (weeks.length > 0) {
          setActiveTab(weeks[0].week.toString());
        }
      }
    } catch (err) {
      console.error("Error fetching timesheet:", err);
      setError(err instanceof Error ? err : new Error("Erreur lors du chargement des données"));
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de la feuille de temps",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchTimesheet();
  }, [id, timesheetCollection]);

  const handleAddProject = (weekIndex: number) => {
    if (!selectedProject) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner un projet",
        variant: "default"
      });
      return;
    }
    
    setWeeklyData(prev => {
      const updated = [...prev];
      const existingProjectIndex = updated[weekIndex].projects.findIndex(
        p => p.projectId === selectedProject
      );
      
      if (existingProjectIndex >= 0) {
        toast({
          title: "Information",
          description: "Ce projet est déjà ajouté à cette semaine",
          variant: "default"
        });
        return prev;
      }
      
      updated[weekIndex].projects.push({
        projectId: selectedProject,
        days: 0
      });
      return updated;
    });
    
    setSelectedProject('');
  };
  
  const handleUpdateDays = (weekIndex: number, projectIndex: number, days: number) => {
    // Ensure days value is between 0 and 5
    const validDays = Math.max(0, Math.min(5, days));
    
    setWeeklyData(prev => {
      const updated = [...prev];
      updated[weekIndex].projects[projectIndex].days = validDays;
      
      // Calculate total days for this week
      const totalDays = updated[weekIndex].projects.reduce((sum, project) => sum + project.days, 0);
      
      // If total days exceed 5, show warning
      if (totalDays > 5) {
        toast({
          title: "Attention",
          description: "Le total des jours ne peut pas dépasser 5 jours par semaine",
          variant: "destructive"
        });
      }
      
      return updated;
    });
  };
  
  const handleRemoveProject = (weekIndex: number, projectIndex: number) => {
    setWeeklyData(prev => {
      const updated = [...prev];
      updated[weekIndex].projects.splice(projectIndex, 1);
      return updated;
    });
  };
  
  const handleSave = async () => {
    if (!timesheet || !timesheet.id) return;
    
    try {
      setSaving(true);
      // Format data for saving
      const weeklyProjects = weeklyData.map(week => ({
        week: week.week,
        startDate: week.startDate,
        endDate: week.endDate,
        projects: week.projects
      }));
      
      await timesheetCollection.update(timesheet.id, {
        ...timesheet,
        weeklyProjects
      });
      
      toast({
        title: "Succès",
        description: "Les données ont été enregistrées avec succès",
        variant: "default"
      });
    } catch (error) {
      console.error("Error saving timesheet:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les données",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = () => {
    setRetrying(true);
    fetchTimesheet();
  };
  
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">Chargement des données...</h1>
          </div>
        </div>
        <Card className="p-8">
          <CardHeader>
            <CardTitle>Récupération des données</CardTitle>
            <CardDescription>Veuillez patienter pendant le chargement des données de la feuille de temps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground text-center">Récupération des données de la feuille de temps...</p>
              <div className="w-full max-w-md">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-red-600">Erreur</h1>
        </div>
        <Card className="border-red-200">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-xl font-semibold">Impossible de charger les données</h2>
              <p className="text-gray-500 max-w-lg mx-auto">{error.message}</p>
              <Button 
                onClick={handleRetry} 
                disabled={retrying} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                {retrying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Nouvelle tentative...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </>
                )}
              </Button>
              <Button 
                onClick={handleBack} 
                variant="outline" 
                className="mt-2"
              >
                Retour aux feuilles de temps
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!timesheet) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Feuille de temps non trouvée</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">La feuille de temps demandée n'existe pas ou a été supprimée.</p>
            <Button onClick={handleBack} className="mt-4">
              Retourner aux feuilles de temps
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Gestion des projets hebdomadaires</h1>
            <p className="text-gray-500">
              Période: {timesheet.weekStartDate && timesheet.weekEndDate 
                ? `${format(parseISO(timesheet.weekStartDate), 'dd/MM/yyyy')} - ${format(parseISO(timesheet.weekEndDate), 'dd/MM/yyyy')}`
                : 'Non définie'}
            </p>
          </div>
        </div>
        <div>
          <Badge className={
            timesheet.status === 'approved' ? 'bg-green-500' :
            timesheet.status === 'submitted' ? 'bg-blue-500' :
            timesheet.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
          }>
            {timesheet.status === 'approved' ? 'Approuvé' :
             timesheet.status === 'submitted' ? 'Soumis' :
             timesheet.status === 'rejected' ? 'Rejeté' : 'Brouillon'}
          </Badge>
        </div>
      </div>
      
      <div className="mb-6">
        <Button 
          onClick={handleSave} 
          className="bg-green-600 hover:bg-green-700"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>
      
      {weeklyData.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap">
            {weeklyData.map((week, index) => (
              <TabsTrigger key={index} value={week.week.toString()}>
                Semaine {week.week}: {format(parseISO(week.startDate), 'dd/MM')} - {format(parseISO(week.endDate), 'dd/MM')}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {weeklyData.map((week, weekIndex) => (
            <TabsContent key={weekIndex} value={week.week.toString()}>
              <Card>
                <CardHeader>
                  <CardTitle>Semaine {week.week}</CardTitle>
                  <CardDescription>
                    Du {format(parseISO(week.startDate), 'dd/MM/yyyy')} au {format(parseISO(week.endDate), 'dd/MM/yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row mb-4 gap-4">
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger className="w-full md:w-[280px]">
                        <SelectValue placeholder="Sélectionner un projet" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name} ({project.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => handleAddProject(weekIndex)}>Ajouter le projet</Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Projet</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Jours (max 5)</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {week.projects.map((project, projectIndex) => {
                          const projectDetails = projects.find(p => p.id === project.projectId) || { id: project.projectId, name: 'Inconnu' };
                          return (
                            <TableRow key={projectIndex}>
                              <TableCell>{projectDetails.id}</TableCell>
                              <TableCell>{projectDetails.name}</TableCell>
                              <TableCell className="w-32">
                                <Input 
                                  type="number" 
                                  min="0" 
                                  max="5" 
                                  value={project.days} 
                                  onChange={(e) => handleUpdateDays(weekIndex, projectIndex, parseFloat(e.target.value))}
                                  className="w-20"
                                />
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveProject(weekIndex, projectIndex)}
                                  className="h-8 w-8 p-0 text-red-500"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {week.projects.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                              Aucun projet ajouté pour cette semaine
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow className="bg-gray-50">
                          <TableCell colSpan={2} className="font-bold">
                            Total
                          </TableCell>
                          <TableCell colSpan={2} className={
                            week.projects.reduce((sum, p) => sum + p.days, 0) > 5 
                              ? 'font-bold text-red-600' 
                              : 'font-bold'
                          }>
                            {week.projects.reduce((sum, p) => sum + p.days, 0)} / 5 jours
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p>Aucune donnée de période disponible pour cette feuille de temps.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeeklyProjectsTimesheet;
