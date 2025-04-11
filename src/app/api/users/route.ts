import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  // Check if user is authenticated and is admin
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Fetch all users with their boards
    const { data: users, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        name,
        role,
        boards (
          id,
          title,
          tasks (
            id,
            title,
            description,
            status,
            priority
          )
        )
      `);

    if (error) {
      throw error;
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 