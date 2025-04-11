export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  boards: Board[];
}

export interface Board {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
} 