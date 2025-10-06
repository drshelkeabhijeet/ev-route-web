'use client'

import { useAuth } from '@/lib/contexts/auth-context'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Car, Map, User, LogOut, Zap, Home, Battery } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Zap className="w-8 h-8 text-green-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                  EV Route
                </span>
              </div>
              <nav className="hidden md:flex space-x-1">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/route">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Map className="w-4 h-4 mr-2" />
                    Plan Route
                  </Button>
                </Link>
                <Link href="/dashboard/stations">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Battery className="w-4 h-4 mr-2" />
                    Find Nearby Stations
                  </Button>
                </Link>
                <Link href="/dashboard/vehicles">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Vehicles
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-around py-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/dashboard/route">
            <Button variant="ghost" size="sm">
              <Map className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/dashboard/stations">
            <Button variant="ghost" size="sm">
              <Battery className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/dashboard/vehicles">
            <Button variant="ghost" size="sm">
              <Car className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button variant="ghost" size="sm">
              <User className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      </div>
    </ProtectedRoute>
  )
}