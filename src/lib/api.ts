import { BoardWithTasks, Task, UserWithBoards } from '@/types';
import { createClient } from './supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getUsers(): Promise<UserWithBoards[]> {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

export async function getUserBoards(userId: string): Promise<UserWithBoards['boards']> {
  const response = await fetch(`${API_URL}/users/${userId}/boards`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user boards');
  }

  return response.json();
}

export async function getBoardTasks(boardId: string): Promise<Task[]> {
  const response = await fetch(`${API_URL}/boards/${boardId}/tasks`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch board tasks');
  }

  return response.json();
} 