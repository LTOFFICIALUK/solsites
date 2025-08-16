"use client"

import { useAuth } from '@/contexts/AuthContext'

export function UserStatus() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="fixed top-4 left-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <span className="text-red-500">⚠️</span>
          <span className="text-sm font-medium">Not logged in</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-4 left-4 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <span className="text-green-500">✅</span>
        <span className="text-sm font-medium">Logged in as: {user.email}</span>
      </div>
    </div>
  )
}



