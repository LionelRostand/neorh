
import React from 'react';
import { ArrowLeft, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TimesheetErrorStateProps {
  error: Error;
  retrying: boolean;
  handleRetry: () => void;
  handleBack: () => void;
}

const TimesheetErrorState: React.FC<TimesheetErrorStateProps> = ({ 
  error, 
  retrying, 
  handleRetry, 
  handleBack 
}) => {
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
};

export default TimesheetErrorState;
