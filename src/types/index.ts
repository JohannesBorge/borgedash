export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'must_get_done' | 'doing_now' | 'finished';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Board {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
} 