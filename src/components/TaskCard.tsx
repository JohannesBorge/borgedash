'use client'

import { useRef } from 'react'
import { useDrag } from 'react-dnd/dist/index.js'
import { TaskCardProps } from '@/types/components'

export default function TaskCard({ task }: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  drag(ref)

  return (
    <div
      ref={ref}
      className={`p-4 rounded-lg shadow-md ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <h3 className="text-lg font-semibold">{task.title}</h3>
      {task.description && (
        <p className="text-gray-600 mt-2">{task.description}</p>
      )}
    </div>
  )
} 