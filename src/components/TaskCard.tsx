'use client'

import { Task } from '@/types/task'
import { Draggable } from '@hello-pangea/dnd'

interface TaskCardProps {
  task: Task
  index: number
}

export default function TaskCard({ task, index }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-2"
        >
          <h3 className="font-medium text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          )}
        </div>
      )}
    </Draggable>
  )
} 