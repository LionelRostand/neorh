
import React from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  handleExport: () => void;
}

const DashboardHeader = ({ handleExport }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord</h1>
        <p className="text-gray-500">Bienvenue dans votre module de gestion des ressources humaines</p>
      </div>
      <div className="mt-4 md:mt-0 flex space-x-2">
        <Button variant="outline" size="sm" onClick={handleExport}>Exporter</Button>
        <Link to="/employes">
          <Button size="sm" className="bg-hr hover:bg-hr-dark">
            <UserPlus className="mr-2 h-4 w-4" />
            Nouvel employé
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
