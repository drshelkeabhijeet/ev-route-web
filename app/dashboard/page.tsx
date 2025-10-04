'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Map, Car, Battery, Navigation } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/contexts/auth-context'

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    { label: 'Total Routes', value: '0', icon: Navigation },
    { label: 'Distance Traveled', value: '0 km', icon: Map },
    { label: 'Energy Saved', value: '0 kWh', icon: Battery },
    { label: 'Vehicles', value: '0', icon: Car },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'Driver'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Plan your next electric journey or manage your vehicles
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Map className="w-5 h-5 mr-2 text-green-600" />
              Plan a Route
            </CardTitle>
            <CardDescription>
              Find the optimal route with charging stations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/route">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Start Planning
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="w-5 h-5 mr-2 text-blue-600" />
              Manage Vehicles
            </CardTitle>
            <CardDescription>
              Add and manage your electric vehicles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/vehicles">
              <Button className="w-full" variant="outline">
                View Vehicles
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Battery className="w-5 h-5 mr-2 text-yellow-600" />
              Nearby Stations
            </CardTitle>
            <CardDescription>
              Find charging stations near you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/stations">
              <Button className="w-full" variant="outline">
                Find Stations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Routes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Routes</CardTitle>
          <CardDescription>Your last planned journeys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Navigation className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No routes planned yet</p>
            <Link href="/dashboard/route">
              <Button className="mt-4" variant="outline">
                Plan Your First Route
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}