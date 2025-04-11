'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import UserList from '@/components/admin/UserList';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkAuthAndFetchUsers() {
      try {
        // Check if user is authenticated
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;
        
        if (!session) {
          router.push('/login');
          return;
        }

        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        if (!profile?.is_admin) {
          router.push('/');
          return;
        }

        // Fetch all users from profiles table
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, email, is_admin')
          .order('email');

        if (usersError) throw usersError;
        setUsers(users || []);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndFetchUsers();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <UserList users={users} />
    </div>
  );
} 