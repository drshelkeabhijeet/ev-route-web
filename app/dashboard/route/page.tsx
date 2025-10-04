'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Battery, MapPin, Navigation, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { routeAPI } from '@/lib/api/client'

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import('@/components/map/Map'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-lg" />
})

export default function RoutePlanningPage() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [batteryLevel, setBatteryLevel] = useState([80])
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number]>([37.7749, -122.4194])
  const [route, setRoute] = useState(null)

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
          setOrigin('Current Location')
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('Could not get your location')
        }
      )
    }
  }, [])

  const handlePlanRoute = async () => {
    if (!origin || !destination) {
      toast.error('Please enter both origin and destination')
      return
    }

    setLoading(true)
    try {
      // Mock route planning for now
      toast.success('Route planned successfully!')

      // In production, use:
      // const response = await routeAPI.planRoute({
      //   origin: { lat: userLocation[0], lng: userLocation[1] },
      //   destination: { lat: 37.3382, lng: -121.8863 }, // Example: San Jose
      //   vehicleId: '1',
      //   currentBattery: batteryLevel[0]
      // })
      // setRoute(response)
    } catch (error) {
      toast.error('Failed to plan route')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Plan Your Route
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Find the optimal route with charging stations for your EV
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Planning Form */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-green-600" />
                Route Details
              </CardTitle>
              <CardDescription>
                Enter your journey details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="origin">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="origin"
                    placeholder="Enter origin or use current location"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="destination"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="battery">
                  Current Battery Level: {batteryLevel[0]}%
                </Label>
                <div className="flex items-center space-x-3">
                  <Battery className="h-4 w-4 text-gray-400" />
                  <Slider
                    id="battery"
                    value={batteryLevel}
                    onValueChange={setBatteryLevel}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <Zap className="h-4 w-4 text-green-600" />
                </div>
              </div>

              <Button
                onClick={handlePlanRoute}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Planning Route...' : 'Plan Route'}
              </Button>
            </CardContent>
          </Card>

          {/* Route Summary (shown after planning) */}
          {route && (
            <Card>
              <CardHeader>
                <CardTitle>Route Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-medium">0 km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">0 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Charging Stops:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Charging Time:</span>
                    <span className="font-medium">0 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Route Map</CardTitle>
              <CardDescription>
                Your route with charging stations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Map center={userLocation} zoom={13} className="h-[600px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}