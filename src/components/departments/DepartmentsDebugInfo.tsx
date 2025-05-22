
import React from "react";

interface DepartmentsDebugInfoProps {
  count: number;
}

const DepartmentsDebugInfo: React.FC<DepartmentsDebugInfoProps> = ({ count }) => {
  return (
    <div className="text-xs text-gray-500 text-center pt-4 border-t">
      Nombre de départements: {count}
      {count === 0 && (
        <div className="text-amber-500 mt-1">
          Aucun département trouvé. Veuillez en créer un pour pouvoir l'associer aux contrats.
        </div>
      )}
    </div>
  );
};

export default DepartmentsDebugInfo;
