'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import GrantAdminAccess from '@/components/GrantAdminAccess'
import { isAdminEmail } from '@/lib/whitelist'
import { useRouter } from 'next/navigation'

type AdminAccess = {
  granted: boolean
  granted_at: string | null
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [adminAccess, setAdminAccess] = useState<AdminAccess | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Check if user is an admin
        if (isAdminEmail(user.email!)) {
          // Automatically grant admin access for admin emails
          const { data } = await supabase
            .from('admin_access')
            .upsert({ 
              id: user.id,
              granted: true,
              granted_at: new Date().toISOString()
            })
            .select('granted, granted_at')
            .single()

          setAdminAccess(data)
        } else {
          // Check existing admin access for non-admin users
          const { data } = await supabase
            .from('admin_access')
            .select('granted, granted_at')
            .eq('id', user.id)
            .single()

          setAdminAccess(data)
        }
      }
      setLoading(false)
    }

    getUser()
  }, [supabase, router])

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
                  onClick={handleSignOut}
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
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                Welcome to your dashboard! You are authenticated as {user.email}
                {isAdminEmail(user.email!) && " (Admin)"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
