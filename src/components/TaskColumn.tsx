'use client'

import { useRef, Suspense } from 'react'
import { useDrop } from 'react-dnd/dist/index.js'
import { Task } from '@/types/task'
import dynamic from 'next/dynamic'

const TaskCard = dynamic(() => import('./TaskCard'), {
  ssr: false,
  loading: () => <div>Loading card...</div>
})

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
          <Suspense key={task.id} fallback={<div>Loading card...</div>}>
            <TaskCard task={task} />
          </Suspense>
        ))}
      </div>
    </div>
  )
} 