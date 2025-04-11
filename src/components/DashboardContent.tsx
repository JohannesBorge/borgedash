'use client'

import { User } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/whitelist'
import GrantAdminAccess from '@/components/GrantAdminAccess'
import TaskBoard from '@/components/TaskBoard'
import { AdminAccess } from '@/types/admin'

interface DashboardContentProps {
  user: User
  adminAccess: AdminAccess | null
  onSignOut: () => void
}

export default function DashboardContent({ user, adminAccess, onSignOut }: DashboardContentProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
              {isAdminEmail(user.email!) && (
                <span className="ml-2 px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.email}</span>
                <button
                  onClick={onSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!adminAccess?.granted && !isAdminEmail(user.email!) ? (
            <div className="max-w-md mx-auto">
              <GrantAdminAccess />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>
              </div>
              <TaskBoard userId={user.id} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 