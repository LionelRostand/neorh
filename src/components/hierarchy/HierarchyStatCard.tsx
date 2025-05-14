
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface HierarchyStatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  bgColor?: string;
  iconColor?: string;
}

const HierarchyStatCard = ({
  title,
  value,
  icon,
  bgColor = "bg-blue-50",
  iconColor = "text-blue-500"
}: HierarchyStatCardProps) => {
  return (
    <Card className="border shadow-sm">
      <CardContent className="flex items-center p-6">
        <div className={`p-3 rounded-full ${bgColor} ${iconColor} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HierarchyStatCard;
