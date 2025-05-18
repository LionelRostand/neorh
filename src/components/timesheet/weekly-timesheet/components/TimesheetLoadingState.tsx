
import React from 'react';
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface TimesheetLoadingStateProps {
  loadingProgress: number;
}

const TimesheetLoadingState: React.FC<TimesheetLoadingStateProps> = ({ loadingProgress }) => {
  return (
    <div className="flex items-center">
      <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
      <h1 className="text-2xl md:text-3xl font-bold">Chargement des données...</h1>
      
      <Card className="p-8 mt-4 w-full">
        <CardHeader>
          <CardTitle>Récupération des données</CardTitle>
          <CardDescription>Veuillez patienter pendant le chargement des données de la feuille de temps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground text-center">Récupération des données de la feuille de temps...</p>
            <div className="w-full max-w-md">
              <Progress value={loadingProgress} className="h-2 mb-2" />
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
};

export default TimesheetLoadingState;
