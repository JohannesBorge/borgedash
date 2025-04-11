'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { Task, TaskStatus } from '@/types/task'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'

const TaskColumn = dynamic<{
  title: string
  tasks: Task[]
  onDrop: (taskId: string) => void
}>(() => import('./TaskColumn'), {
  ssr: false,
  loading: () => <div>Loading column...</div>
})

interface TaskBoardProps {
  userId: string
}

export default function TaskBoard({ userId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchTasks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [userId, supabase])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleDrop = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)

      if (error) throw error

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      )
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const columns = [
    { id: 'todo' as TaskStatus, title: 'To Do' },
    { id: 'in-progress' as TaskStatus, title: 'In Progress' },
    { id: 'done' as TaskStatus, title: 'Done' },
  ]

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {columns.map((column) => (
        <Suspense key={column.id} fallback={<div>Loading column...</div>}>
          <TaskColumn
            title={column.title}
            tasks={tasks.filter((t) => t.status === column.id)}
            onDrop={(taskId: string) => handleDrop(taskId, column.id)}
          />
        </Suspense>
      ))}
    </div>
  )
} 