
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWeeklyTimesheetPage } from './hooks/useWeeklyTimesheetPage';
import TimesheetHeader from './components/TimesheetHeader';
import TimesheetLoadingState from './components/TimesheetLoadingState';
import TimesheetErrorState from './components/TimesheetErrorState';
import TimesheetNotFound from './components/TimesheetNotFound';
import TimesheetContent from './components/TimesheetContent';

const WeeklyProjectsTimesheet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    timesheet,
    loading,
    error,
    saving,
    retrying,
    projects,
    selectedProject,
    setSelectedProject,
    weeklyData,
    activeTab,
    setActiveTab,
    loadingProgress,
    handleAddProject,
    handleUpdateDays,
    handleRemoveProject,
    handleSave,
    handleRetry,
    fetchAttempted
  } = useWeeklyTimesheetPage(id || '');
  
  const handleBack = () => {
    navigate(-1);
  };

  if (loading && !fetchAttempted) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <TimesheetLoadingState loadingProgress={loadingProgress} />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <TimesheetErrorState
        error={error}
        retrying={retrying}
        handleRetry={handleRetry}
        handleBack={handleBack}
      />
    );
  }
  
  if (!timesheet) {
    return <TimesheetNotFound handleBack={handleBack} />;
  }

  return (
    <div className="p-4 md:p-6">
      <TimesheetHeader 
        timesheet={timesheet}
        saving={saving}
        handleSave={handleSave}
        handleBack={handleBack}
      />
      
      <TimesheetContent
        weeklyData={weeklyData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        handleAddProject={handleAddProject}
        handleUpdateDays={handleUpdateDays}
        handleRemoveProject={handleRemoveProject}
      />
    </div>
  );
};

export default WeeklyProjectsTimesheet;
