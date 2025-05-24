
import React from "react";
import { Users } from "lucide-react";

const EmptyStateMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Users className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aucun employé trouvé
      </h3>
      <p className="text-gray-500 max-w-md">
        Vous devez d'abord ajouter des employés pour pouvoir gérer leurs permissions. 
        Rendez-vous dans le menu Employés pour commencer.
      </p>
    </div>
  );
};

export default EmptyStateMessage;
