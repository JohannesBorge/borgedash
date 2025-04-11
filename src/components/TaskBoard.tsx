'use client'

import { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { createClient } from '@/lib/supabase/client'
import TaskColumn from './TaskColumn'
import { Task } from '@/types/task'

const COLUMNS = [
  { id: 'must_get_done', title: 'Must Get Done' },
  { id: 'doing_now', title: 'Doing Now' },
  { id: 'finished', title: 'Finished' },
]

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const moveTask = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId)

      if (error) throw error
      await fetchTasks()
    } catch (error) {
      console.error('Error moving task:', error)
    }
  }

  const addTask = async (title: string, description: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title,
          description,
          status: 'must_get_done'
        })

      if (error) throw error
      await fetchTasks()
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading tasks...</h2>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-4 p-4">
        {COLUMNS.map(column => (
          <TaskColumn
            key={column.id}
            title={column.title}
            tasks={tasks.filter(task => task.status === column.id)}
            onMoveTask={moveTask}
            onAddTask={addTask}
          />
        ))}
      </div>
    </DndProvider>
  )
} 