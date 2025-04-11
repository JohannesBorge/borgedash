'use client'

import { useState } from 'react'
import { useDrop } from 'react-dnd'
import TaskCard from './TaskCard'
import { Task } from '@/types/task'

interface TaskColumnProps {
  title: string
  tasks: Task[]
  onMoveTask: (taskId: string, newStatus: string) => void
  onAddTask: (title: string, description: string) => void
}

export default function TaskColumn({ title, tasks, onMoveTask, onAddTask }: TaskColumnProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [isAddingTask, setIsAddingTask] = useState(false)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => {
      onMoveTask(item.id, title.toLowerCase().replace(' ', '_'))
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle, newTaskDescription)
      setNewTaskTitle('')
      setNewTaskDescription('')
      setIsAddingTask(false)
    }
  }

  return (
    <div
      ref={drop}
      className={`flex-1 p-4 rounded-lg ${
        isOver ? 'bg-gray-100' : 'bg-white'
      } shadow-sm`}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      
      {isAddingTask && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title"
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task description"
            className="w-full p-2 mb-2 border rounded"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
            <button
              onClick={() => setIsAddingTask(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {!isAddingTask && (
        <button
          onClick={() => setIsAddingTask(true)}
          className="mt-4 w-full py-2 text-gray-500 hover:text-gray-700"
        >
          + Add Task
        </button>
      )}
    </div>
  )
} 