'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Zap, Map, Battery, Car } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-green-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
              EV Route
            </span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-green-600 hover:bg-green-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Plan Your Electric Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Find optimal routes for your EV with intelligent charging station integration.
            Never worry about running out of battery again.
          </p>
          <div className="flex justify-center space-x-4 mb-16">
            <Link href="/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Planning Routes
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <Map className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Smart Route Planning
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered route optimization considering your vehicle range and charging needs
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <Battery className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Charging Stations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time data on charging station availability, pricing, and compatibility
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                <Car className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Vehicle Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Support for all EV models with accurate range and charging specifications
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-6 h-6 text-green-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                EV Route
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 EV Route. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
