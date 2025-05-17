
import { Employee } from './employee';

export type ProjectStatus = 'active' | 'pending' | 'completed' | 'canceled';

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  manager?: {
    id: string;
    name: string;
    photoURL?: string;
  };
  team?: {
    id: string;
    name: string;
    photoURL?: string;
  }[];
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  budget?: number;
  budgetSpent?: number;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

// Placeholder components - will implement later
export const NewProjectDialog = (props: any) => null;
export const EditProjectDialog = (props: any) => null;
export const DeleteProjectConfirmDialog = (props: any) => null;
export const ViewProjectDialog = (props: any) => null;
