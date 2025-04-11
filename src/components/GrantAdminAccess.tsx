'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function GrantAdminAccess() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleGrantAccess = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('admin_access')
        .upsert({ 
          id: user.id,
          granted: true,
          granted_at: new Date().toISOString()
        })

      if (error) throw error
      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-md">
        Admin access granted successfully!
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Grant Admin Access</h2>
      <p className="text-gray-600 mb-4">
        By clicking the button below, you grant admin access to your data. This cannot be undone.
      </p>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      <button
        onClick={handleGrantAccess}
        disabled={loading}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Granting Access...' : 'Grant Admin Access'}
      </button>
    </div>
  )
} 