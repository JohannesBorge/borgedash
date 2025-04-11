'use client';

import { BoardWithTasks } from '@/types';

interface BoardPreviewProps {
  board: BoardWithTasks;
}

export default function BoardPreview({ board }: BoardPreviewProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h4 className="font-medium text-gray-800 mb-2">{board.title}</h4>
      <div className="space-y-2">
        {board.tasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className="text-sm p-2 bg-gray-50 rounded border border-gray-200"
          >
            <p className="font-medium text-gray-700">{task.title}</p>
            <p className="text-xs text-gray-500">
              Status: {task.status}
            </p>
          </div>
        ))}
        {board.tasks.length > 3 && (
          <p className="text-xs text-gray-500 text-center">
            +{board.tasks.length - 3} more tasks
          </p>
        )}
      </div>
    </div>
  );
} 