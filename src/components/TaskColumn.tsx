'use client'

import { useRef } from 'react'
import { useDrop } from 'react-dnd/dist/index.js'
import { Task } from '@/types/task'
import TaskCard from './TaskCard'

interface TaskColumnProps {
  title: string
  tasks: Task[]
  onDrop: (taskId: string) => void
}

export default function TaskColumn({ title, tasks, onDrop }: TaskColumnProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  drop(ref)

  return (
    <div
      ref={ref}
      className={`p-4 rounded-lg ${
        isOver ? 'bg-gray-100' : 'bg-white'
      } shadow-sm`}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
} 