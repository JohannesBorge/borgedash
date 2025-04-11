export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  status: 'must_get_done' | 'doing_now' | 'finished'
  created_at: string
  updated_at: string
} 