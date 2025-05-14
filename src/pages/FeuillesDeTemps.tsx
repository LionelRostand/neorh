
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Plus, Edit, Check, X } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { Timesheet } from "@/lib/constants";

const FeuillesDeTemps = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Utilisation du hook useCollection pour accéder à la collection des feuilles de temps
  const timesheetCollection = useCollection<'hr_timesheet'>();

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const data = await timesheetCollection.getAll();
        
        if (data.length === 0) {
          // Si aucune feuille de temps n'existe encore, utilisons des données fictives
          setTimesheets([
            {
              id: "1",
              employeeId: "1",
              date: "2025-05-10",
              taskDescription: "Développement frontend",
              hoursWorked: 8,
              status: "approved",
              submittedAt: "2025-05-10T18:00:00",
              approvedBy: "Manager1",
              approvedAt: "2025-05-11T09:30:00"
            },
            {
              id: "2",
              employeeId: "2",
              date: "2025-05-11",
              projectId: "PROJ-001",
              taskDescription: "Réunion client",
              hoursWorked: 2,
              status: "submitted",
              submittedAt: "2025-05-11T17:45:00"
            },
            {
              id: "3",
              employeeId: "1",
              date: "2025-05-12",
              projectId: "PROJ-002",
              taskDescription: "Tests d'intégration",
              hoursWorked: 6,
              status: "draft"
            }
          ]);
        } else {
          setTimesheets(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des feuilles de temps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheets();
  }, []);

  const handleAddTimesheet = () => {
    // Cette fonction sera implémentée plus tard
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-500">Soumis</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500">Brouillon</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejeté</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Feuilles de temps</h1>
          <p className="text-gray-500">Gestion du temps de travail par employé et par projet</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" onClick={handleAddTimesheet}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle feuille
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feuilles de temps</CardTitle>
          <CardDescription>
            Suivi du temps de travail par employé, projet et tâche
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Chargement des feuilles de temps...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employé ID</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Heures</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timesheets.map((timesheet) => (
                  <TableRow key={timesheet.id}>
                    <TableCell>{timesheet.date}</TableCell>
                    <TableCell>{timesheet.employeeId}</TableCell>
                    <TableCell>{timesheet.projectId || '-'}</TableCell>
                    <TableCell>{timesheet.taskDescription}</TableCell>
                    <TableCell>{timesheet.hoursWorked}h</TableCell>
                    <TableCell>{getStatusBadge(timesheet.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {timesheet.status === 'submitted' && (
                        <>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-500">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeuillesDeTemps;
