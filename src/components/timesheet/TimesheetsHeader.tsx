
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

interface TimesheetsHeaderProps {
  onNewTimesheet: () => void;
}

const TimesheetsHeader = ({ onNewTimesheet }: TimesheetsHeaderProps) => {
  return (
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
        <Button size="sm" onClick={onNewTimesheet}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle feuille
        </Button>
      </div>
    </div>
  );
};

export default TimesheetsHeader;
