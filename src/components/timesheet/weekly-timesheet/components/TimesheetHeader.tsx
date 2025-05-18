
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timesheet } from "@/lib/constants";

interface TimesheetHeaderProps {
  timesheet: Timesheet;
  saving: boolean;
  handleSave: () => void;
  handleBack: () => void;
}

const TimesheetHeader: React.FC<TimesheetHeaderProps> = ({ 
  timesheet, 
  saving, 
  handleSave, 
  handleBack 
}) => {
  return (
    <>
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
    </>
  );
};

export default TimesheetHeader;
