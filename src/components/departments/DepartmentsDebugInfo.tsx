
import React from "react";

interface DepartmentsDebugInfoProps {
  count: number;
}

const DepartmentsDebugInfo: React.FC<DepartmentsDebugInfoProps> = ({ count }) => {
  return (
    <div className="text-xs text-gray-500 text-center pt-4 border-t">
      Nombre de départements: {count}
    </div>
  );
};

export default DepartmentsDebugInfo;
