
import React, { useState, useEffect } from 'react';
import { format, addDays, parseISO, differenceInCalendarDays } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Save, X, AlertCircle, Loader2 } from "lucide-react";
import { useFirestore } from '@/hooks/firestore';
import { Timesheet } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";

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

interface WeeklyProjectsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timesheetId: string;
  onSuccess?: () => void;
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

const WeeklyProjectsDialog = ({ open, onOpenChange, timesheetId, onSuccess }: WeeklyProjectsDialogProps) => {
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);
  const [projects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const timesheetCollection = useFirestore<Timesheet>('hr_timesheet');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Progress animation effect
  useEffect(() => {
    if (loading && !error) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev < 90) {
            return prev + 10;
          }
          return prev;
        });
      }, 300);

      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [loading, error]);

  // Fetch the timesheet data
  useEffect(() => {
    if (!open || !timesheetId) return;
    
    const fetchTimesheet = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching timesheet with ID:", timesheetId);
        const result = await timesheetCollection.getById(timesheetId);
        
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
      }
    };

    fetchTimesheet();
  }, [open, timesheetId, timesheetCollection]);

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
      
      if (onSuccess) {
        onSuccess();
      }
      
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestion des projets hebdomadaires</DialogTitle>
        </DialogHeader>
        
        {loading && (
          <div className="p-8">
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground text-center">Récupération des données de la feuille de temps...</p>
              <div className="w-full max-w-md">
                <Progress value={loadingProgress} className="h-2 mb-2" />
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="p-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-xl font-semibold">Impossible de charger les données</h2>
              <p className="text-gray-500 max-w-lg mx-auto">{error.message}</p>
            </div>
          </div>
        )}
        
        {!loading && !error && timesheet && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500">
                  Période: {timesheet.weekStartDate && timesheet.weekEndDate 
                    ? `${format(parseISO(timesheet.weekStartDate), 'dd/MM/yyyy')} - ${format(parseISO(timesheet.weekEndDate), 'dd/MM/yyyy')}`
                    : 'Non définie'}
                </p>
              </div>
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
            
            {weeklyData.length > 0 ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 flex flex-wrap">
                  {weeklyData.map((week, index) => (
                    <TabsTrigger key={index} value={week.week.toString()}>
                      Semaine {week.week}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {weeklyData.map((week, weekIndex) => (
                  <TabsContent key={weekIndex} value={week.week.toString()}>
                    <div className="space-y-4">
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
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="py-6 text-center">
                <p>Aucune donnée de période disponible pour cette feuille de temps.</p>
              </div>
            )}
          </>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button 
            onClick={handleSave} 
            className="bg-green-600 hover:bg-green-700"
            disabled={saving || loading || !!error}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklyProjectsDialog;
