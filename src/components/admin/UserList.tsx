'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserListProps {
  users: User[];
}

interface UserTaskCounts {
  [userId: string]: {
    must_get_done: number;
    doing_now: number;
    finished: number;
  };
}

export default function UserList({ users }: UserListProps) {
  const router = useRouter();
  const [taskCounts, setTaskCounts] = useState<UserTaskCounts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchTaskCounts() {
      try {
        const counts: UserTaskCounts = {};
        
        for (const user of users) {
          const { data: tasks, error } = await supabase
            .from('tasks')
            .select('status')
            .eq('user_id', user.id);

          if (error) throw error;

          counts[user.id] = {
            must_get_done: tasks?.filter(t => t.status === 'must_get_done').length || 0,
            doing_now: tasks?.filter(t => t.status === 'doing_now').length || 0,
            finished: tasks?.filter(t => t.status === 'finished').length || 0,
          };
        }

        setTaskCounts(counts);
      } catch (err) {
        setError('Failed to load task counts');
        console.error('Error fetching task counts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTaskCounts();
  }, [users, supabase]);

  const handleUserClick = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="grid gap-4 p-4">
        {users.map((user) => (
          <Card 
            key={user.id} 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleUserClick(user.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{user.email}</span>
                <Button variant="ghost" size="sm">
                  View Boards
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-32 bg-gray-100 rounded-lg p-4">
                  <h3 className="font-medium">To Do</h3>
                  <p className="text-sm text-gray-500">
                    {loading ? '...' : `${taskCounts[user.id]?.must_get_done || 0} tasks`}
                  </p>
                </div>
                <div className="h-32 bg-gray-100 rounded-lg p-4">
                  <h3 className="font-medium">In Progress</h3>
                  <p className="text-sm text-gray-500">
                    {loading ? '...' : `${taskCounts[user.id]?.doing_now || 0} tasks`}
                  </p>
                </div>
                <div className="h-32 bg-gray-100 rounded-lg p-4">
                  <h3 className="font-medium">Done</h3>
                  <p className="text-sm text-gray-500">
                    {loading ? '...' : `${taskCounts[user.id]?.finished || 0} tasks`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
} 