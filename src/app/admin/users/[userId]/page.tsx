'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBoards } from '@/lib/api';
import { Board } from '@/types';
import TaskColumn from '@/components/TaskColumn';

export default function UserBoardPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const { userId } = useParams();

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }

    const fetchBoards = async () => {
      try {
        const userBoards = await getUserBoards(userId as string);
        setBoards(userBoards);
      } catch (error) {
        console.error('Error fetching user boards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [user, router, userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Boards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <div key={board.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{board.name}</h2>
            <div className="grid grid-cols-3 gap-4">
              <TaskColumn
                title="Must Get Done"
                tasks={board.tasks.filter((task) => task.status === 'must_get_done')}
                status="must_get_done"
              />
              <TaskColumn
                title="Doing Now"
                tasks={board.tasks.filter((task) => task.status === 'doing_now')}
                status="doing_now"
              />
              <TaskColumn
                title="Finished"
                tasks={board.tasks.filter((task) => task.status === 'finished')}
                status="finished"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 