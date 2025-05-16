
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeaveFormLabels } from "@/hooks/leaves/form";
import { Badge } from "@/components/ui/badge";

interface LeaveTypesListProps {
  title?: string;
}

const LeaveTypesList = ({ title = "Types de congés disponibles" }: LeaveTypesListProps) => {
  const { getLeaveTypeOptions } = useLeaveFormLabels();
  const leaveTypes = getLeaveTypeOptions();

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {leaveTypes.map((type) => (
            <Badge 
              key={type.value} 
              className="px-3 py-1 text-sm"
              variant="outline"
            >
              {type.label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveTypesList;
