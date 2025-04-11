import { cookies } from 'next/headers'

const CLICKUP_API_URL = 'https://api.clickup.com/api/v2'

interface ClickUpToken {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
}

export class ClickUpAPI {
  private static instance: ClickUpAPI
  private accessToken: string | null = null

  private constructor() {}

  public static getInstance(): ClickUpAPI {
    if (!ClickUpAPI.instance) {
      ClickUpAPI.instance = new ClickUpAPI()
    }
    return ClickUpAPI.instance
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('clickup_token')
    
    if (token?.value) {
      this.accessToken = token.value
      return this.accessToken
    }

    // If no token in cookies, we need to authenticate
    throw new Error('No ClickUp access token found. Please authenticate first.')
  }

  public async getTeams() {
    const token = await this.getAccessToken()
    const response = await fetch(`${CLICKUP_API_URL}/team`, {
      headers: {
        Authorization: token,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch teams')
    }

    return response.json()
  }

  public async getTeamMembers(teamId: string) {
    const token = await this.getAccessToken()
    const response = await fetch(`${CLICKUP_API_URL}/team/${teamId}/member`, {
      headers: {
        Authorization: token,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch team members')
    }

    return response.json()
  }

  public async getTasks(teamId: string, assigneeId?: string) {
    const token = await this.getAccessToken()
    let url = `${CLICKUP_API_URL}/team/${teamId}/task`
    
    if (assigneeId) {
      url += `?assignees[]=${assigneeId}`
    }

    const response = await fetch(url, {
      headers: {
        Authorization: token,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }

    return response.json()
  }

  public async getTaskStatus(taskId: string) {
    const token = await this.getAccessToken()
    const response = await fetch(`${CLICKUP_API_URL}/task/${taskId}`, {
      headers: {
        Authorization: token,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch task status')
    }

    return response.json()
  }
} 