import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // TODO: Replace with actual database query
    const boards = [
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
          {
            id: '2',
            title: 'Task 2',
            description: 'Description 2',
            status: 'in-progress',
            priority: 'medium',
          },
        ],
      },
      // Add more mock boards as needed
    ];

    return NextResponse.json(boards);
  } catch (error) {
    console.error('Error fetching user boards:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 