'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import DashboardContent from '@/components/DashboardContent'
import { AdminAccess } from '@/types/admin'
import { isAdminEmail } from '@/lib/whitelist'

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

  return <DashboardContent user={user} adminAccess={adminAccess} onSignOut={handleSignOut} />
}
