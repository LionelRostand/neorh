
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import WeeklyTabContent from './WeeklyTabContent';
import { Project, WeeklyData } from "../../types";

interface TimesheetContentProps {
  weeklyData: WeeklyData[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projects: Project[];
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  handleAddProject: (weekIndex: number) => void;
  handleUpdateDays: (weekIndex: number, projectIndex: number, days: number) => void;
  handleRemoveProject: (weekIndex: number, projectIndex: number) => void;
}

const TimesheetContent: React.FC<TimesheetContentProps> = ({ 
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
  if (weeklyData.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p>Aucune donnée de période disponible pour cette feuille de temps.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6 flex flex-wrap">
        {weeklyData.map((week, index) => (
          <TabsTrigger key={index} value={week.week.toString()}>
            Semaine {week.week}: {format(parseISO(week.startDate), 'dd/MM')} - {format(parseISO(week.endDate), 'dd/MM')}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {weeklyData.map((week, weekIndex) => (
        <TabsContent key={weekIndex} value={week.week.toString()}>
          <Card>
            <CardHeader>
              <CardTitle>Semaine {week.week}</CardTitle>
              <CardDescription>
                Du {format(parseISO(week.startDate), 'dd/MM/yyyy')} au {format(parseISO(week.endDate), 'dd/MM/yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TimesheetContent;
