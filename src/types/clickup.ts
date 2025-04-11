export interface ClickUpTeam {
  id: string
  name: string
  color: string
  avatar: string | null
  members: ClickUpMember[]
}

export interface ClickUpMember {
  user: {
    id: number
    username: string
    email: string
    color: string
    profilePicture: string | null
  }
}

export interface ClickUpTask {
  id: string
  name: string
  status: {
    status: string
    color: string
  }
  assignees: ClickUpMember[]
  due_date: string | null
  date_created: string
  date_updated: string
  start_date: string | null
  time_estimate: number | null
  time_spent: number | null
}

export interface ClickUpTaskStatus {
  status: string
  color: string
  orderindex: number
  type: string
} 