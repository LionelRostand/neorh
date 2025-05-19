
import React from "react";
import EvaluationsHeader from "@/components/evaluations/EvaluationsHeader";
import EvaluationStatusCards from "@/components/evaluations/EvaluationStatusCards";
import EvaluationsContent from "@/components/evaluations/EvaluationsContent";
import { useEvaluationsPage } from "@/hooks/useEvaluationsPage";

const Evaluations = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedEmployee,
    setSelectedEmployee,
    filteredEvaluations,
    loading,
    fetchEvaluations,
    handleNewEvaluation,
    handleDelete,
    handleModify,
    handleManage,
    statusCounts,
    coverageRate,
    employees
  } = useEvaluationsPage();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <EvaluationsHeader 
        onNewEvaluation={handleNewEvaluation} 
      />

      <EvaluationStatusCards 
        active={statusCounts.planifiée} 
        pending={statusCounts.complétée} 
        expired={statusCounts.annulée} 
        coverage={coverageRate} 
      />

      <EvaluationsContent
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedEmployee={selectedEmployee}
        onEmployeeChange={setSelectedEmployee}
        employees={employees}
        filteredEvaluations={filteredEvaluations}
        loading={loading}
        onDelete={handleDelete}
        onModify={handleModify}
        onManage={handleManage}
        onRefresh={fetchEvaluations}
      />
    </div>
  );
};

export default Evaluations;
