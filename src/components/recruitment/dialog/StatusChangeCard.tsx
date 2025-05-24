
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecruitmentStatus } from "@/types/recruitment";

interface StatusOption {
  value: RecruitmentStatus;
  label: string;
  color: string;
}

interface StatusChangeCardProps {
  currentStatus: RecruitmentStatus;
  onStatusChange: (status: RecruitmentStatus) => void;
}

const StatusChangeCard: React.FC<StatusChangeCardProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const statusOptions: StatusOption[] = [
    { value: 'ouverte', label: 'Ouverte', color: 'bg-blue-100 text-blue-800' },
    { value: 'en_cours', label: 'En cours', color: 'bg-amber-100 text-amber-800' },
    { value: 'entretiens', label: 'Entretiens', color: 'bg-purple-100 text-purple-800' },
    { value: 'offre', label: 'Offre', color: 'bg-green-100 text-green-800' },
    { value: 'fermée', label: 'Fermée', color: 'bg-gray-100 text-gray-800' }
  ];

  const getCurrentStatusOption = () => {
    return statusOptions.find(option => option.value === currentStatus);
  };

  const currentStatusOption = getCurrentStatusOption();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Changer le statut</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600 mb-2">Statut actuel :</div>
          {currentStatusOption && (
            <Badge variant="outline" className={currentStatusOption.color}>
              {currentStatusOption.label}
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={currentStatus === option.value ? "default" : "outline"}
              className={currentStatus === option.value ? "" : "justify-start"}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusChangeCard;
