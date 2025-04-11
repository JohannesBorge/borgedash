export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  user_id: string
  created_at: string
  updated_at: string
} 