
export interface Skill {
  id?: string;
  employeeId: string;
  name: string;
  level: number; // 1-5
  category?: string;
  description?: string;
  createdAt?: string;
}
