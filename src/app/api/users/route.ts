import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // TODO: Replace with actual database query
    const users = [
      {
        id: '1',
        email: 'user1@example.com',
        name: 'User One',
        role: 'user',
        boards: [
          {
            id: '1',
            title: 'Project A',
            tasks: [
              {
                id: '1',
                title: 'Task 1',
                description: 'Description 1',
                status: 'todo',
                priority: 'high',
              },
            ],
          },
        ],
      },
      // Add more mock users as needed
    ];

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 