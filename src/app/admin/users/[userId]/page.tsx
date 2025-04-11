'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useParams, useRouter } from 'next/navigation';
import TaskColumn from '@/components/TaskColumn';
import { Task } from '@/types/task';

export default function UserBoard() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkAuthAndFetchData() {
      try {
        // Check if user is authenticated
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;
        
        if (!session) {
          router.push('/login');
          return;
        }

        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        if (!profile?.is_admin) {
          router.push('/');
          return;
        }

        // Fetch user
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', params.userId)
          .single();

        if (userError) throw userError;
        setUser(userData);

        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', params.userId);

        if (tasksError) throw tasksError;
        setTasks(tasksData || []);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndFetchData();
  }, [params.userId, supabase, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  const todoTasks = tasks.filter(task => task.status === 'must_get_done');
  const inProgressTasks = tasks.filter(task => task.status === 'doing_now');
  const doneTasks = tasks.filter(task => task.status === 'finished');

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {user?.email}&apos;s Board
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Back to Users
        </button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <TaskColumn title="To Do" tasks={todoTasks} status="must_get_done" />
        <TaskColumn title="In Progress" tasks={inProgressTasks} status="doing_now" />
        <TaskColumn title="Done" tasks={doneTasks} status="finished" />
      </div>
    </div>
  );
} 