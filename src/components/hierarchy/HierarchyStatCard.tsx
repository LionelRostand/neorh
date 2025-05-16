
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface HierarchyStatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  textColor: string;
  bgColor: string;
  borderColor: string;
  iconColor?: string;
}

const HierarchyStatCard = ({
  title,
  value,
  icon,
  textColor = "text-blue-700",
  bgColor = "bg-blue-100",
  borderColor = "border-blue-500",
  iconColor
}: HierarchyStatCardProps) => {
  return (
    <Card className={`border ${borderColor} rounded-lg`}>
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start">
            <p className={`text-sm font-medium ${textColor}`}>{title}</p>
            <div className={`p-1.5 rounded ${bgColor}`}>
              <div className={iconColor}>{icon}</div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-4xl font-bold">{value}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {value === 0 ? `Aucun ${title.toLowerCase()}` : 
               value === 1 ? `${value} ${title.toLowerCase()}` : 
               `${value} ${title.toLowerCase()}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HierarchyStatCard;
