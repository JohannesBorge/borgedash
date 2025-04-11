export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  user_id: string;
  created_at: string;
  updated_at: string;
} 