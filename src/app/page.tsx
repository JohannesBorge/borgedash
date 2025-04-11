import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import LoginButton from '@/components/LoginButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ClickUp Accountability Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
              Track and manage team accountability through ClickUp
            </p>
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  )
}
