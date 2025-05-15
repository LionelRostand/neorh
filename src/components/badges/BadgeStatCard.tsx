
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface BadgeStatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  description?: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const BadgeStatCard = ({
  title,
  value,
  icon,
  description,
  textColor,
  bgColor,
  borderColor
}: BadgeStatCardProps) => {
  return (
    <Card className={`border ${borderColor} rounded-lg`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-sm font-medium ${textColor}`}>{title}</p>
            <h3 className="text-3xl font-bold mt-1">{value}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {description || (value === 0 
                ? `Aucun ${title.toLowerCase()}` 
                : value === 1 
                ? `1 ${title.toLowerCase()}` 
                : `${value} ${title.toLowerCase()}`
              )}
            </p>
          </div>
          <div className={`p-2 rounded-full ${bgColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeStatCard;
