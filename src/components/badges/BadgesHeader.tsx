
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

interface BadgesHeaderProps {
  onAddBadge: () => void;
}

const BadgesHeader = ({ onAddBadge }: BadgesHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Badges et accès</h1>
        <p className="text-gray-500">Gestion des badges d'identification et des droits d'accès</p>
      </div>
      <div className="mt-4 md:mt-0 flex space-x-2">
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Exporter
        </Button>
        <Button size="sm" onClick={onAddBadge}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau badge
        </Button>
      </div>
    </div>
  );
};

export default BadgesHeader;
