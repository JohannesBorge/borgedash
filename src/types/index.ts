export interface User {
  id: string;
  email: string;
  boards?: Board[];
}

export interface Board {
  id: string;
  name: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  boardId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
} 