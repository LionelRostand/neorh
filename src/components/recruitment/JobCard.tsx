
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface JobCardProps {
  id: string;
  title: string;
  department: string;
  onClick?: () => void;
}

const JobCard = ({ id, title, department, onClick }: JobCardProps) => {
  return (
    <Card 
      className="mb-2 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <h4 className="font-medium">{title}</h4>
        <p className="text-xs text-gray-500">{department}</p>
      </CardContent>
    </Card>
  );
};

export default JobCard;
