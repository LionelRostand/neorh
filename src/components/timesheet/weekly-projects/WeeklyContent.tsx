
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WeeklyTabContent from "./WeeklyTabContent";
import { WeeklyContentProps } from "../types";

const WeeklyContent: React.FC<WeeklyContentProps> = ({ 
  timesheet,
  weeklyData,
  activeTab,
  setActiveTab,
  projects,
  selectedProject,
  setSelectedProject,
  handleAddProject,
  handleUpdateDays,
  handleRemoveProject
}) => {
  if (!timesheet) return null;
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-500">
            Période: {timesheet.weekStartDate && timesheet.weekEndDate 
              ? `${format(parseISO(timesheet.weekStartDate), 'dd/MM/yyyy')} - ${format(parseISO(timesheet.weekEndDate), 'dd/MM/yyyy')}`
              : 'Non définie'}
          </p>
        </div>
        <Badge className={
          timesheet.status === 'approved' ? 'bg-green-500' :
          timesheet.status === 'submitted' ? 'bg-blue-500' :
          timesheet.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
        }>
          {timesheet.status === 'approved' ? 'Approuvé' :
           timesheet.status === 'submitted' ? 'Soumis' :
           timesheet.status === 'rejected' ? 'Rejeté' : 'Brouillon'}
        </Badge>
      </div>
      
      {weeklyData.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex flex-wrap">
            {weeklyData.map((week, index) => (
              <TabsTrigger key={index} value={week.week.toString()}>
                Semaine {week.week}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {weeklyData.map((week, weekIndex) => (
            <TabsContent key={weekIndex} value={week.week.toString()}>
              <WeeklyTabContent 
                week={week}
                weekIndex={weekIndex}
                projects={projects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                handleAddProject={handleAddProject}
                handleUpdateDays={handleUpdateDays}
                handleRemoveProject={handleRemoveProject}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="py-6 text-center">
          <p>Aucune donnée de période disponible pour cette feuille de temps.</p>
        </div>
      )}
    </>
  );
};

export default WeeklyContent;
