
import React from "react";

interface DepartmentsDebugInfoProps {
  count: number;
}

const DepartmentsDebugInfo: React.FC<DepartmentsDebugInfoProps> = ({ count }) => {
  return (
    <div className="text-xs text-gray-500 mt-4">
      Nombre de départements: {count}
    </div>
  );
};

export default DepartmentsDebugInfo;
