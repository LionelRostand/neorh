
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface RecruitmentStatusCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  bgColor: string;
  subtitle: string;
}

const RecruitmentStatusCard = ({
  title,
  count,
  icon,
  bgColor,
  subtitle
}: RecruitmentStatusCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h2 className="text-3xl font-bold mt-1">{count}</h2>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className={`p-2 rounded-full ${bgColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecruitmentStatusCard;
