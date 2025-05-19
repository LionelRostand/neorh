
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; 
import { RefreshCw } from "lucide-react";
import EvaluationsFilters from "./EvaluationsFilters";
import EvaluationTable from "./EvaluationTable";
import { Evaluation } from "@/hooks/useEmployeeEvaluations";

interface EvaluationsContentProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedEmployee: string;
  onEmployeeChange: (value: string) => void;
  employees: { id: string; name: string }[] | null;
  filteredEvaluations: Evaluation[];
  loading: boolean;
  onDelete: (id: string) => void;
  onModify: (id: string) => void;
  onManage: (id: string) => void;
  onRefresh: () => void;
}

const EvaluationsContent = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedEmployee,
  onEmployeeChange,
  employees,
  filteredEvaluations,
  loading,
  onDelete,
  onModify,
  onManage,
  onRefresh
}: EvaluationsContentProps) => {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Liste des évaluations</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Rafraîchir
          </Button>
        </div>
        
        <EvaluationsFilters 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
          selectedEmployee={selectedEmployee}
          onEmployeeChange={onEmployeeChange}
          employees={employees}
        />

        <EvaluationTable 
          evaluations={filteredEvaluations}
          loading={loading}
          onDelete={onDelete}
          onModify={onModify}
          onManage={onManage}
        />
      </CardContent>
    </Card>
  );
};

export default EvaluationsContent;
