
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timesheet } from "@/lib/constants";
import TimesheetStatusCards from "@/components/timesheet/TimesheetStatusCards";
import TimesheetsTable from "@/components/timesheet/TimesheetsTable";

interface TimesheetsContentProps {
  timesheets: Timesheet[];
  loading: boolean;
  countByStatus: {
    draft: number;
    submitted: number;
    approved: number;
    rejected: number;
  };
}

const TimesheetsContent = ({ 
  timesheets, 
  loading, 
  countByStatus 
}: TimesheetsContentProps) => {
  // Afficher un message de débogage pour voir les données reçues
  console.log('TimesheetsContent rendering with:', {timesheets, loading, countByStatus});
  
  return (
    <>
      <TimesheetStatusCards 
        drafts={countByStatus.draft}
        submitted={countByStatus.submitted}
        approved={countByStatus.approved}
        rejected={countByStatus.rejected}
      />

      <Card>
        <CardHeader>
          <CardTitle>Feuilles de temps</CardTitle>
          <CardDescription>
            Suivi du temps de travail par employé, projet et tâche
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimesheetsTable 
            timesheets={timesheets} 
            loading={loading} 
          />
        </CardContent>
      </Card>
    </>
  );
};

export default TimesheetsContent;
