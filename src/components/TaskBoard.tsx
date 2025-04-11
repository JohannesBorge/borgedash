'use client'

import { Task } from '@/types/task'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import TaskColumn from './TaskColumn'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Task Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          <TaskColumn 
            title="Must Get Done" 
            tasks={mustGetDoneTasks} 
            status="must_get_done" 
          />
          <TaskColumn 
            title="Doing Now" 
            tasks={doingNowTasks} 
            status="doing_now" 
          />
          <TaskColumn 
            title="Finished" 
            tasks={finishedTasks} 
            status="finished" 
          />
        </div>
      </DragDropContext>
    </div>
  )
} 