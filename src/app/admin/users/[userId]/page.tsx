'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Board, Task } from '@/types';
import { getUserBoards, getBoardTasks } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const ADMIN_EMAILS = ['johborge@gmail.com'];

export default function UserBoardView({ params }: { params: { userId: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !ADMIN_EMAILS.includes(user.email))) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const boardsData = await getUserBoards(params.userId);
        const boardsWithTasks = await Promise.all(
          boardsData.map(async (board) => {
            const tasks = await getBoardTasks(board.id);
            return { ...board, tasks };
          })
        );
        setBoards(boardsWithTasks);
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        setLoadingBoards(false);
      }
    };

    if (user && ADMIN_EMAILS.includes(user.email)) {
      fetchBoards();
    }
  }, [user, params.userId]);

  if (loading || loadingBoards) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">User Boards</h1>
        <Button variant="outline" onClick={() => router.push('/admin')}>
          Back to Dashboard
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Card key={board.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{board.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {board.tasks?.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-muted rounded-lg"
                    >
                      <h3 className="font-semibold mb-2">{task.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        Status: {task.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 