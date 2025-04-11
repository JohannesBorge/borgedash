'use client';

import { useState } from 'react';
import { UserWithBoards } from '@/types';
import { useRouter } from 'next/navigation';
import BoardPreview from './BoardPreview';

interface UserListProps {
  users: UserWithBoards[];
}

export default function UserList({ users: initialUsers }: UserListProps) {
  const router = useRouter();
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Filter users based on search term
  const filteredUsers = initialUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleUserClick = (userId: string) => {
    setExpandedUserId(userId);
  };

  const handleViewFullBoard = async (userId: string) => {
    try {
      router.push(`/admin/users/${userId}`);
    } catch (error) {
      console.error('Error navigating to user board:', error);
      setError('Failed to navigate to user board. Please try again.');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (initialUsers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* User List */}
      <div className="space-y-4">
        {paginatedUsers.map((user) => (
          <div
            key={user.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleUserClick(user.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {user.boards.length} {user.boards.length === 1 ? 'board' : 'boards'}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewFullBoard(user.id);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                View Full Board
              </button>
            </div>
            
            {expandedUserId === user.id && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {user.boards.slice(0, 3).map((board) => (
                  <BoardPreview key={board.id} board={board} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 