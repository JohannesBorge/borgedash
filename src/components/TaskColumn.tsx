'use client'

import { Task } from '@/types/task'
import { Droppable } from '@hello-pangea/dnd'
import TaskCard from './TaskCard'

interface TaskColumnProps {
  title: string
  tasks: Task[]
  status: 'must_get_done' | 'doing_now' | 'finished'
}

export default function TaskColumn({ title, tasks, status }: TaskColumnProps) {
  return (
    <div className="flex-1 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px]"
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
} 