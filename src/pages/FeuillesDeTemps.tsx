
import React, { useState } from 'react';
import TimesheetsHeader from "@/components/timesheet/TimesheetsHeader";
import TimesheetsContent from "@/components/timesheet/TimesheetsContent";
import NewTimesheetForm from "@/components/timesheet/NewTimesheetForm";
import { useTimesheetData } from "@/hooks/useTimesheetData";

const FeuillesDeTemps = () => {
  const [isNewTimesheetOpen, setIsNewTimesheetOpen] = useState(false);
  const { timesheets, loading, countByStatus, refreshTimesheets } = useTimesheetData();

  console.log('FeuillesDeTemps page rendering with:', {timesheets, loading, countByStatus});

  const handleOpenNewTimesheet = () => {
    setIsNewTimesheetOpen(true);
  };

  const handleCloseNewTimesheet = () => {
    setIsNewTimesheetOpen(false);
  };

  const handleTimesheetCreated = () => {
    // Refresh the timesheet list
    refreshTimesheets();
  };

  return (
    <div className="p-4 md:p-6">
      <TimesheetsHeader onNewTimesheet={handleOpenNewTimesheet} />
      
      <TimesheetsContent
        timesheets={timesheets}
        loading={loading}
        countByStatus={countByStatus}
        onRefresh={refreshTimesheets}
      />

      <NewTimesheetForm 
        open={isNewTimesheetOpen} 
        onClose={handleCloseNewTimesheet} 
        onSuccess={handleTimesheetCreated} 
      />
    </div>
  );
};

export default FeuillesDeTemps;
