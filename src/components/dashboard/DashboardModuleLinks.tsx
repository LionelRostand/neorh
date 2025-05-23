
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { navItems } from "@/components/sidebar/NavItems";

const DashboardModuleLinks = () => {
  // Filtrer pour prendre tous les items sauf "Tableau de bord" et "Paramètres"
  const moduleItems = navItems.filter(item => 
    item.title !== "Tableau de bord" && 
    item.title !== "Paramètres" && 
    item.title !== "Rapports"
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">MODULES RH</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {moduleItems.map((item, index) => (
            <Button 
              key={index} 
              variant="outline" 
              className="flex flex-col h-auto py-4 justify-center items-center"
              asChild
            >
              <Link to={item.href}>
                {item.icon}
                <span className="text-xs mt-1">{item.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardModuleLinks;
