'use client'

import { Task } from '@/types/task'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import TaskColumn from './TaskColumn'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('must_get_done')
  const [isAddingTask, setIsAddingTask] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching tasks:', error)
        return
      }

      setTasks(data || [])
    }

    fetchTasks()
  }, [supabase])

  const mustGetDoneTasks = tasks.filter(task => task.status === 'must_get_done')
  const doingNowTasks = tasks.filter(task => task.status === 'doing_now')
  const finishedTasks = tasks.filter(task => task.status === 'finished')

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result
    if (source.droppableId === destination.droppableId) return

    const taskId = result.draggableId
    const newStatus = destination.droppableId as Task['status']

    // Update task status in database
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)

    if (error) {
      console.error('Error updating task status:', error)
      return
    }

    // Update local state
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: newTaskTitle,
          status: newTaskStatus,
          user_id: user.id
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error adding task:', error)
      return
    }

    setTasks([data, ...tasks])
    setNewTaskTitle('')
    setIsAddingTask(false)
  }

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      console.error('Error deleting task:', error)
      return
    }

    setTasks(tasks.filter(task => task.id !== taskId))
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Board</h1>
        <button
          onClick={() => setIsAddingTask(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Task
        </button>
      </div>

      {isAddingTask && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Add New Task</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={newTaskStatus}
              onChange={(e) => setNewTaskStatus(e.target.value as Task['status'])}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="must_get_done">Must Get Done</option>
              <option value="doing_now">Doing Now</option>
              <option value="finished">Finished</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          <TaskColumn 
            title="Must Get Done" 
            tasks={mustGetDoneTasks} 
            status="must_get_done"
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn 
            title="Doing Now" 
            tasks={doingNowTasks} 
            status="doing_now"
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn 
            title="Finished" 
            tasks={finishedTasks} 
            status="finished"
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </DragDropContext>
    </div>
  )
} 