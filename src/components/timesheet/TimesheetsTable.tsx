
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Check, X, PlusCircle } from "lucide-react";
import { Timesheet } from "@/lib/constants";
import { useNavigate } from 'react-router-dom';
import WeeklyProjectsDialog from './WeeklyProjectsDialog';

interface TimesheetsTableProps {
  timesheets: Timesheet[];
  loading: boolean;
  onRefresh?: () => void;
}

const TimesheetsTable = ({ timesheets, loading, onRefresh }: TimesheetsTableProps) => {
  const navigate = useNavigate();
  const [selectedTimesheetId, setSelectedTimesheetId] = useState<string | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  
  console.log('TimesheetsTable rendering with:', {
    timesheetsCount: timesheets?.length || 0,
    loading
  });

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

  const handleEditTimesheet = (timesheetId: string) => {
    navigate(`/feuilles-de-temps/edit/${timesheetId}`);
  };

  const handleManageWeeklyProjects = (timesheetId: string) => {
    setSelectedTimesheetId(timesheetId);
    setIsProjectDialogOpen(true);
  };

  const handleProjectsDialogClose = () => {
    setIsProjectDialogOpen(false);
    setSelectedTimesheetId(null);
    if (onRefresh) {
      onRefresh();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Chargement des feuilles de temps...</p>
      </div>
    );
  }

  if (!timesheets || timesheets.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Aucune feuille de temps trouvée.</p>
      </div>
    );
  }

  // Filter out incomplete timesheets that don't have required fields
  const validTimesheets = timesheets.filter(timesheet => 
    timesheet && timesheet.id && (timesheet.status || timesheet.weekStartDate || timesheet.employeeId)
  );

  if (validTimesheets.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Aucune feuille de temps valide trouvée.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Employé ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validTimesheets.map((timesheet) => (
            <TableRow key={timesheet.id}>
              <TableCell>{timesheet.date || (timesheet.weekStartDate ? `${timesheet.weekStartDate} - ${timesheet.weekEndDate || ''}` : 'Non défini')}</TableCell>
              <TableCell>{timesheet.employeeId || 'Non défini'}</TableCell>
              <TableCell>{timesheet.taskDescription || '-'}</TableCell>
              <TableCell>{getStatusBadge(timesheet.status || 'draft')}</TableCell>
              <TableCell className="text-right flex justify-end items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleEditTimesheet(timesheet.id || '')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2"
                  onClick={() => handleManageWeeklyProjects(timesheet.id || '')}
                >
                  <PlusCircle className="h-3 w-3" />
                  Projets
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
      
      <WeeklyProjectsDialog 
        open={isProjectDialogOpen} 
        onOpenChange={setIsProjectDialogOpen} 
        timesheetId={selectedTimesheetId || ''}
        onSuccess={onRefresh}
      />
    </>
  );
};

export default TimesheetsTable;
