import { createClient } from '@/lib/supabase/client';
import { User, Board } from '@/types';

const supabase = createClient();

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    throw new Error('Failed to fetch users');
  }

  return data;
}

export async function getUserBoards(userId: string): Promise<Board[]> {
  const { data, error } = await supabase
    .from('boards')
    .select(`
      *,
      tasks (*)
    `)
    .eq('user_id', userId);

  if (error) {
    throw new Error('Failed to fetch user boards');
  }

  return data;
} 