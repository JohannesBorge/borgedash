import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ClickUpAPI } from '@/lib/clickup'
import DashboardContent from '@/components/DashboardContent'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('clickup_token')

  if (!token) {
    redirect('/')
  }

  const clickup = ClickUpAPI.getInstance()
  
  try {
    const teams = await clickup.getTeams()
    const team = teams.teams[0] // Get the first team for now
    const [members, tasks] = await Promise.all([
      clickup.getTeamMembers(team.id),
      clickup.getTasks(team.id)
    ])

    return <DashboardContent team={team} members={members} tasks={tasks} />
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Dashboard
          </h1>
          <p className="text-gray-600">
            There was an error loading your dashboard data. Please try again later.
          </p>
        </div>
      </div>
    )
  }
} 