
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { navItems } from "@/components/sidebar/NavItems";
import { Badge } from "@/components/ui/badge";

interface DashboardModuleLinksProps {
  stats?: {
    employees?: number;
    documents?: number;
    contracts?: number;
    leaves?: number;
    [key: string]: number | undefined;
  };
}

const DashboardModuleLinks = ({ stats = {} }: DashboardModuleLinksProps) => {
  // Filtrer pour prendre tous les items sauf "Tableau de bord" et "Paramètres"
  const moduleItems = navItems.filter(item => 
    item.title !== "Tableau de bord" && 
    item.title !== "Paramètres" && 
    item.title !== "Rapports"
  );
  
  const getStatForModule = (title: string): { count?: number; color?: string } => {
    switch (title) {
      case "Employés":
        return { count: stats.employees, color: "bg-blue-100 text-blue-800" };
      case "Documents RH":
        return { count: stats.documents, color: "bg-emerald-100 text-emerald-800" };
      case "Contrats":
        return { count: stats.contracts, color: "bg-purple-100 text-purple-800" };
      case "Congés":
        return { count: stats.leaves, color: "bg-amber-100 text-amber-800" };
      default:
        return {};
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">MODULES RH</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {moduleItems.map((item, index) => {
            const moduleStat = getStatForModule(item.title);
            
            return (
              <Button 
                key={index} 
                variant="outline" 
                className="flex flex-col h-auto py-4 justify-center items-center relative"
                asChild
              >
                <Link to={item.href}>
                  {moduleStat.count !== undefined && (
                    <Badge className={`absolute -top-2 -right-2 ${moduleStat.color}`}>
                      {moduleStat.count}
                    </Badge>
                  )}
                  {item.icon}
                  <span className="text-xs mt-1">{item.title}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardModuleLinks;
