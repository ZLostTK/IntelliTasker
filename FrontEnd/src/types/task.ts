export interface Subtask {
  id: string;
  title: string;
  estimatedHours: number;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  estimatedHours: number;
  completed: boolean;
  subtasks: Subtask[];
  created_at?: string;
  updated_at?: string;
}
