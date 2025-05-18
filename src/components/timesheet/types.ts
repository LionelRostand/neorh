
import { Timesheet } from "@/lib/constants";

export interface Project {
  id: string;
  name: string;
}

export interface WeeklyData {
  week: number;
  startDate: string;
  endDate: string;
  projects: WeeklyProjectTime[];
}

export interface WeeklyProjectTime {
  projectId: string;
  days: number;
}

export interface WeeklyProjectsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timesheetId: string;
  onSuccess?: () => void;
}

export interface ProjectRowProps {
  project: WeeklyProjectTime;
  projectIndex: number;
  weekIndex: number;
  projectDetails: Project;
  onUpdateDays: (weekIndex: number, projectIndex: number, days: number) => void;
  onRemoveProject: (weekIndex: number, projectIndex: number) => void;
}

export interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  onAddProject: () => void;
}

export interface WeeklyTabContentProps {
  week: WeeklyData;
  weekIndex: number;
  projects: Project[];
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  handleAddProject: (weekIndex: number) => void;
  handleUpdateDays: (weekIndex: number, projectIndex: number, days: number) => void;
  handleRemoveProject: (weekIndex: number, projectIndex: number) => void;
  handleSubmitWeek: (weekIndex: number) => void;
  isSubmittable: boolean;
  timesheet: Timesheet | null;
}

export interface WeeklyContentProps {
  timesheet: Timesheet | null;
  weeklyData: WeeklyData[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projects: Project[];
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  handleAddProject: (weekIndex: number) => void;
  handleUpdateDays: (weekIndex: number, projectIndex: number, days: number) => void;
  handleRemoveProject: (weekIndex: number, projectIndex: number) => void;
  handleSubmitWeek: (weekIndex: number) => void;
  isSubmittable: boolean;
}

export interface LoadingStateProps {
  loadingProgress: number;
}

export interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}
