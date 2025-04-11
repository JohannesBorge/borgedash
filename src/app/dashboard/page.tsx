'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import TaskBoard from '@/components/TaskBoard'
import { User } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/whitelist'
import Link from 'next/link'
import { ClickUpAPI } from '@/lib/clickup'
import { ClickUpTeam, ClickUpMember, ClickUpTask } from '@/types/clickup'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('clickup_token')

  if (!token) {
    redirect('/')
  }

  const clickup = ClickUpAPI.getInstance()
  const teams = await clickup.getTeams()
  const team = teams.teams[0] // Get the first team for now
  const members = await clickup.getTeamMembers(team.id)
  const tasks = await clickup.getTasks(team.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {team.name} Dashboard
            </h1>
            
            {/* Team Members Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Team Members
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.members.map((member: ClickUpMember) => (
                  <div
                    key={member.user.id}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {member.user.profilePicture ? (
                        <img
                          src={member.user.profilePicture}
                          alt={member.user.username}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: member.user.color }}
                        >
                          <span className="text-white font-medium">
                            {member.user.username[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {member.user.username}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Tasks
              </h2>
              <div className="space-y-4">
                {tasks.tasks.map((task: ClickUpTask) => (
                  <div
                    key={task.id}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {task.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: task.status.color }}
                          />
                          <span className="text-sm text-gray-500">
                            {task.status.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                        {task.assignees.map((assignee) => (
                          <div
                            key={assignee.user.id}
                            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center"
                            style={{ backgroundColor: assignee.user.color }}
                          >
                            <span className="text-white text-xs font-medium">
                              {assignee.user.username[0].toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 