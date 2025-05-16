
import React, { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface HierarchyStatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  textColor: string;
  bgColor?: string;
  borderColor?: string;
  iconColor?: string;
  subtitle?: string;
}

const HierarchyStatCard = ({
  title,
  value,
  icon,
  textColor,
  bgColor,
  borderColor,
  iconColor,
  subtitle
}: HierarchyStatCardProps) => {
  // Generate the subtitle if not provided
  const generatedSubtitle = subtitle || (() => {
    if (value === 0) {
      return `Aucun ${title.toLowerCase()}`;
    } else if (value === 1) {
      // Handle singular form
      return `${value} ${title.toLowerCase().replace(/s$/, '')}`;
    } else {
      return `${value} ${title.toLowerCase()}`;
    }
  })();

  return (
    <Card className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>
          <div className={`p-2 rounded-full ${iconColor ? iconColor : 'text-primary'}`}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-5xl font-bold">{value}</p>
          <p className="text-xs text-gray-500 mt-2">{generatedSubtitle}</p>
        </div>
      </div>
    </Card>
  );
};

export default HierarchyStatCard;
