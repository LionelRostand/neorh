
import React from 'react';
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TimesheetNotFoundProps {
  handleBack: () => void;
}

const TimesheetNotFound: React.FC<TimesheetNotFoundProps> = ({ handleBack }) => {
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
};

export default TimesheetNotFound;
