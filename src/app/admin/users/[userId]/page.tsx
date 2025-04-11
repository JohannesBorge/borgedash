'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Board, Task } from '@/types';
import { getUserBoards, getBoardTasks } from '@/lib/api';
import BoardPreview from '@/components/admin/BoardPreview';

interface UserBoardPageProps {
  params: {
    userId: string;
  };
}

export default function UserBoardPage({ params }: UserBoardPageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const fetchedBoards = await getUserBoards(params.userId);
        setBoards(fetchedBoards);
        setError(null);
      } catch (error) {
        console.error('Error fetching boards:', error);
        setError('Failed to load boards. Please try again later.');
      } finally {
        setLoadingBoards(false);
      }
    };

    if (user?.role === 'admin') {
      fetchBoards();
    }
  }, [user, params.userId]);

  if (loading || loadingBoards) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">User Boards</h1>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {boards.map((board) => (
              <BoardPreview key={board.id} board={board} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 