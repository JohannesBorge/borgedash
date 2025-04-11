import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const CLICKUP_AUTH_URL = 'https://app.clickup.com/api/v2/oauth/token'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    const response = await fetch(CLICKUP_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.CLICKUP_CLIENT_ID,
        client_secret: process.env.CLICKUP_CLIENT_SECRET,
        code,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get access token')
    }

    const data = await response.json()
    const cookieStore = await cookies()
    
    // Set the access token in a cookie
    cookieStore.set('clickup_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
  }
} 