
import React from "react";

const EmptyStateMessage = () => {
  return (
    <div className="p-4 bg-amber-50 text-amber-800 rounded-md">
      Aucun employé n'a été trouvé. Veuillez d'abord ajouter des employés dans le module Employés.
    </div>
  );
};

export default EmptyStateMessage;
