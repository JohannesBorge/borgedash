'use client';

import { useState, useEffect } from 'react';
import { Board } from '@/types';

interface BoardPreviewProps {
  board: Board;
}

export default function BoardPreview({ board }: BoardPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todoTasks = board.tasks.filter(task => task.status === 'todo');
  const inProgressTasks = board.tasks.filter(task => task.status === 'in-progress');
  const doneTasks = board.tasks.filter(task => task.status === 'done');

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
          {error}
        </div>
      )}
      <h4 className="font-medium text-gray-800 mb-3">{board.title}</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">To Do</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            {todoTasks.length}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">In Progress</span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
            {inProgressTasks.length}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Done</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            {doneTasks.length}
          </span>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        Total tasks: {board.tasks.length}
      </div>
    </div>
  );
} 