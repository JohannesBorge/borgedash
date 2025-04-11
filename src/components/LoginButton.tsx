'use client'

import { useSearchParams } from 'next/navigation'

export default function LoginButton() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_CLICKUP_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_CLICKUP_REDIRECT_URI
    const authUrl = `https://app.clickup.com/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`
    window.location.href = authUrl
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="text-red-500">
          Authentication failed. Please try again.
        </div>
      )}
      <button
        onClick={handleLogin}
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Login with ClickUp
      </button>
    </div>
  )
} 