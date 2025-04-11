'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import TaskBoard from '@/components/TaskBoard'
import { User } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/whitelist'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const isUserAdmin = isAdminEmail(user.email!)
        setIsAdmin(isUserAdmin)
        
        if (isUserAdmin) {
          // Automatically grant admin access for admin emails
          await supabase
            .from('admin_access')
            .upsert({ 
              id: user.id,
              granted: true,
              granted_at: new Date().toISOString()
            })
        }
      }
      setLoading(false)
    }

    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we check your authentication status.</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Middleware will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {isAdmin ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign Out
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-indigo-800 mb-2">Admin Tools</h3>
                  <p className="text-gray-600 mb-4">Access administrative features and manage the system.</p>
                  <Link 
                    href="/admin" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Go to Admin Panel
                  </Link>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-2">User Management</h3>
                  <p className="text-gray-600 mb-4">View and manage user accounts and permissions.</p>
                  <Link 
                    href="/admin/users" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Manage Users
                  </Link>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-800 mb-2">System Overview</h3>
                  <p className="text-gray-600 mb-4">View system statistics and performance metrics.</p>
                  <Link 
                    href="/admin/stats" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    View Statistics
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign Out
                </button>
              </div>
              <TaskBoard />
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 