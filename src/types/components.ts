import { Task, TaskStatus } from './task'

export interface TaskCardProps {
  task: Task
}

export interface TaskColumnProps {
  title: string
  tasks: Task[]
  onDrop: (taskId: string) => void
}

export interface TaskBoardProps {
  userId: string
} 