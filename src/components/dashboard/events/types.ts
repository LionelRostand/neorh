
export interface Event {
  id: string;
  title: string;
  date: string;
  type: 'meeting' | 'training' | 'evaluation' | 'other';
  description: string;
}
