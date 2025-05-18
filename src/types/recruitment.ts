
export interface RecruitmentPost {
  id: string;
  title: string;
  department: string;
  description?: string;
  requirements?: string[];
  location?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  contractType?: string;
  status: RecruitmentStatus;
  applications?: number;
  createdAt: string;
  updatedAt?: string;
  closingDate?: string;
  hiringManagerId?: string;
  priority?: 'low' | 'medium' | 'high';
  candidateId?: string;
  candidateName?: string;
  nextStep?: string;
}

export type RecruitmentStatus = 
  | 'ouverte'      // Open
  | 'en_cours'     // In progress
  | 'entretiens'   // Interviews
  | 'offre'        // Offer
  | 'fermée';      // Closed

export interface RecruitmentStatsData {
  openPositions: number;
  inProgress: number;
  filledPositions: number;
  applications: number;
  interviews: number;
}

export interface KanbanColumn {
  id: RecruitmentStatus;
  title: string;
  items: RecruitmentPost[];
}
