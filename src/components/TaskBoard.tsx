'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { User } from '@supabase/supabase-js'

type Task = {
  id: string
  title: string
  description: string
  status: 'must_get_done' | 'doing_now' | 'finished'
  position: number
}

type Column = {
  id: 'must_get_done' | 'doing_now' | 'finished'
  title: string
  tasks: Task[]
}

export default function TaskBoard() {
  const [columns, setColumns] = useState<Column[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('position')

      if (error) throw error

      // Initialize columns with empty tasks
      const initialColumns: Column[] = [
        { id: 'must_get_done', title: 'Must Get Done', tasks: [] },
        { id: 'doing_now', title: 'Doing Now', tasks: [] },
        { id: 'finished', title: 'Finished', tasks: [] }
      ]

      // Group tasks by status
      tasks?.forEach(task => {
        const column = initialColumns.find(col => col.id === task.status)
        if (column) {
          column.tasks.push(task)
        }
      })

      setColumns(initialColumns)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const sourceColumn = columns.find(col => col.id === source.droppableId)
    const destColumn = columns.find(col => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    const sourceTasks = [...sourceColumn.tasks]
    const destTasks = source.droppableId === destination.droppableId 
      ? sourceTasks 
      : [...destColumn.tasks]

    const [movedTask] = sourceTasks.splice(source.index, 1)
    movedTask.status = destination.droppableId as Task['status']
    destTasks.splice(destination.index, 0, movedTask)

    // Update positions
    destTasks.forEach((task, index) => {
      task.position = index
    })

    // Update state
    const newColumns = columns.map(column => {
      if (column.id === source.droppableId) {
        return { ...column, tasks: sourceTasks }
      }
      if (column.id === destination.droppableId) {
        return { ...column, tasks: destTasks }
      }
      return column
    })

    setColumns(newColumns)

    // Update database
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: movedTask.status,
          position: destination.index,
          updated_at: new Date().toISOString()
        })
        .eq('id', movedTask.id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating task:', error)
      // Revert state on error
      fetchTasks()
    }
  }

  const addTask = async (columnId: Column['id']) => {
    const title = prompt('Enter task title:')
    if (!title) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title,
          description: '',
          status: columnId,
          position: columns.find(col => col.id === columnId)?.tasks.length || 0
        })
        .select()
        .single()

      if (error) throw error
      fetchTasks()
    } catch (error) {
      console.error('Error adding task:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
        {error}
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {columns.map(column => (
          <div key={column.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{column.title}</h2>
              <button
                onClick={() => addTask(column.id)}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Add Task
              </button>
            </div>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[200px]"
                >
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 rounded-lg shadow mb-2"
                        >
                          <h3 className="font-medium">{task.title}</h3>
                          {task.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
} 