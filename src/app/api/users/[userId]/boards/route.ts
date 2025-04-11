import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
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
    // Fetch user's boards
    const { data: boards, error } = await supabase
      .from('boards')
      .select(`
        id,
        title,
        tasks (
          id,
          title,
          description,
          status,
          priority
        )
      `)
      .eq('user_id', params.userId);

    if (error) {
      throw error;
    }

    return NextResponse.json(boards);
  } catch (error) {
    console.error('Error fetching user boards:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 