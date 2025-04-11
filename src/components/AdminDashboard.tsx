'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Board } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { getUsers, getUserBoards } from '@/lib/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [userBoards, setUserBoards] = useState<Record<string, Board[]>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }

    const fetchUsersAndBoards = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);

        // Fetch boards for each user
        const boardsByUser: Record<string, Board[]> = {};
        for (const user of fetchedUsers) {
          const boards = await getUserBoards(user.id);
          boardsByUser[user.id] = boards;
        }
        setUserBoards(boardsByUser);
      } catch (error) {
        console.error('Error fetching users and boards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndBoards();
  }, [user, router]);

  const handleUserClick = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => handleUserClick(user.id)}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
            <div className="space-y-4">
              {userBoards[user.id]?.slice(0, 3).map((board) => (
                <div key={board.id} className="border rounded p-3">
                  <h3 className="font-medium">{board.name}</h3>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="text-sm text-gray-500">
                      Must Get Done: {board.tasks.filter(t => t.status === 'must_get_done').length}
                    </div>
                    <div className="text-sm text-gray-500">
                      Doing Now: {board.tasks.filter(t => t.status === 'doing_now').length}
                    </div>
                    <div className="text-sm text-gray-500">
                      Finished: {board.tasks.filter(t => t.status === 'finished').length}
                    </div>
                  </div>
                </div>
              ))}
              {userBoards[user.id]?.length > 3 && (
                <div className="text-sm text-gray-500 text-center">
                  +{userBoards[user.id].length - 3} more boards
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 