'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Battery, MapPin, Search, Zap, Clock, DollarSign } from 'lucide-react'
import { ChargingStation } from '@/lib/types'
import { stationsAPI } from '@/lib/api/client'
import { toast } from 'sonner'

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import('@/components/map/Map'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg" />
})

export default function StationsPage() {
  const [searchLocation, setSearchLocation] = useState('')
  const [radius, setRadius] = useState([10])
  const [userLocation, setUserLocation] = useState<[number, number]>([37.7749, -122.4194])
  const [stations, setStations] = useState<ChargingStation[]>([])
  const [loading, setLoading] = useState(false)

  // Mock charging stations data
  const mockStations: ChargingStation[] = [
    {
      id: '1',
      name: 'Tesla Supercharger - San Francisco',
      location: { lat: 37.7849, lng: -122.4094 },
      address: '123 Market St, San Francisco, CA',
      chargers: [
        { type: 'Tesla Supercharger', power: 250, count: 8, available: 6 },
        { type: 'Tesla Destination', power: 11, count: 4, available: 4 }
      ],
      amenities: ['Restrooms', 'Food', 'WiFi'],
      distance: 0.5
    },
    {
      id: '2',
      name: 'Electrify America - Downtown',
      location: { lat: 37.7849, lng: -122.4194 },
      address: '456 Mission St, San Francisco, CA',
      chargers: [
        { type: 'CCS', power: 350, count: 4, available: 3 },
        { type: 'CHAdeMO', power: 50, count: 2, available: 2 }
      ],
      amenities: ['Restrooms', 'Coffee Shop'],
      distance: 1.2
    },
    {
      id: '3',
      name: 'ChargePoint - Marina District',
      location: { lat: 37.8049, lng: -122.4394 },
      address: '789 Beach St, San Francisco, CA',
      chargers: [
        { type: 'J1772', power: 7.2, count: 6, available: 5 },
        { type: 'CCS', power: 50, count: 2, available: 1 }
      ],
      amenities: ['Restrooms', 'Shopping'],
      distance: 2.1
    }
  ]

  // Get user's current location and auto-search for nearby stations
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation: [number, number] = [position.coords.latitude, position.coords.longitude]
          setUserLocation(newLocation)
          
          // Auto-search for nearby stations
          try {
            setLoading(true)
            const response = await stationsAPI.getNearbyStations(
              newLocation[0], 
              newLocation[1], 
              radius[0]
            )
            
            console.log('Auto-search API Response:', response)
            
            // Handle the actual n8n response format
            let stationsData = []
            if (response.stations) {
              stationsData = response.stations
            } else if (response.data && response.data.stations) {
              stationsData = response.data.stations
            } else if (Array.isArray(response)) {
              stationsData = response
            } else {
              console.warn('Unexpected response format:', response)
              throw new Error('Invalid response format from API')
            }
            
            const transformedStations: ChargingStation[] = stationsData.map((station: any) => ({
              id: station.place_id || station.id || `station-${Math.random()}`,
              name: station.station_name || station.name || 'Unknown Station',
              location: {
                lat: station.location?.latitude || station.latitude || 0,
                lng: station.location?.longitude || station.longitude || 0
              },
              address: station.address || 'Address not available',
              chargers: [{
                type: station.connector_types?.[0] || 'Unknown',
                power: station.charging_speed_kw || 0,
                count: station.connector_types?.length || 1,
                available: station.availability || 0
              }],
              amenities: [], // n8n response doesn't include amenities
              distance: station.distance_km || 0
            }))

            setStations(transformedStations)
            toast.success(`Found ${transformedStations.length} charging stations near you`)
          } catch (error: any) {
            console.error('Error fetching nearby stations:', error)
            
            // Log specific error details for debugging
            if (error.response?.status === 500) {
              console.error('n8n workflow error (500):', error.response?.data)
            } else if (error.response?.status === 404) {
              console.error('Webhook not found (404):', error.response?.data)
            } else {
              console.error('Other error:', error.message)
            }
            
            // Don't show error toast on auto-search, just use mock data
            setStations(mockStations)
          } finally {
            setLoading(false)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('Could not get your location')
        }
      )
    }
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    try {
      console.log('Searching for stations at:', userLocation[0], userLocation[1], 'radius:', radius[0])
      
      // Call the n8n webhook for real charging station data
      const response = await stationsAPI.getNearbyStations(
        userLocation[0], 
        userLocation[1], 
        radius[0]
      )
      
      console.log('API Response:', response)
      
      // Handle the actual n8n response format
      let stationsData = []
      if (response.stations) {
        stationsData = response.stations
      } else if (response.data && response.data.stations) {
        stationsData = response.data.stations
      } else if (Array.isArray(response)) {
        stationsData = response
      } else {
        console.warn('Unexpected response format:', response)
        throw new Error('Invalid response format from API')
      }
      
      // Transform the n8n response to match our ChargingStation interface
      const transformedStations: ChargingStation[] = stationsData.map((station: any) => ({
        id: station.place_id || station.id || `station-${Math.random()}`,
        name: station.station_name || station.name || 'Unknown Station',
        location: {
          lat: station.location?.latitude || station.latitude || 0,
          lng: station.location?.longitude || station.longitude || 0
        },
        address: station.address || 'Address not available',
        chargers: [{
          type: station.connector_types?.[0] || 'Unknown',
          power: station.charging_speed_kw || 0,
          count: station.connector_types?.length || 1,
          available: station.availability || 0
        }],
        amenities: [], // n8n response doesn't include amenities
        distance: station.distance_km || 0,
        is_selected: station.is_selected || false,
        isSelected: station.is_selected || false
      }))

      setStations(transformedStations)
      toast.success(`Found ${transformedStations.length} charging stations`)
    } catch (error: any) {
      console.error('Error fetching stations:', error)
      
      // Show specific error messages based on the error type
      if (error.response?.status === 500) {
        toast.error('Server error (500): The n8n workflow may have an issue. Check the webhook configuration.')
      } else if (error.response?.status === 404) {
        toast.error('Webhook not found (404): Check if the webhook URL is correct.')
      } else if (error.response?.status === 400) {
        toast.error('Bad request (400): Check the request parameters.')
      } else if (error.code === 'NETWORK_ERROR') {
        toast.error('Network error: Check your internet connection.')
      } else {
        toast.error(`Failed to search for stations: ${error.message || 'Unknown error'}`)
      }
      
      // Fallback to mock data for development
      setStations(mockStations)
    } finally {
      setLoading(false)
    }
  }

  const getStationStatus = (station: ChargingStation) => {
    const totalChargers = station.chargers.reduce((sum, charger) => sum + charger.count, 0)
    const availableChargers = station.chargers.reduce((sum, charger) => sum + charger.available, 0)
    const availability = (availableChargers / totalChargers) * 100

    if (availability >= 75) return { status: 'Good', color: 'text-green-600' }
    if (availability >= 50) return { status: 'Moderate', color: 'text-yellow-600' }
    return { status: 'Limited', color: 'text-red-600' }
  }

  const openGoogleMaps = (station: ChargingStation) => {
    const { lat, lng } = station.location
    const address = encodeURIComponent(station.address)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${station.id}`
    window.open(url, '_blank')
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Fullscreen Map Background */}
      <div className="absolute inset-0 z-0">
        <Map
          center={userLocation}
          zoom={13}
          stations={stations}
          className="h-full w-full"
          onStationClick={(station) => {
            console.log('Station clicked:', station)
            toast.info(`Selected: ${station.name}`)
          }}
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 h-full flex">
        {/* Left Sidebar - Search Panel */}
        <div className="w-96 bg-white/95 backdrop-blur-sm border-r border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Charging Stations
              </h1>
              <p className="text-gray-600 mt-1">
                Find charging stations near you
              </p>
            </div>

            {/* Search Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2 text-green-600" />
                  Search Stations
                </CardTitle>
                <CardDescription>
                  Find charging stations by location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="Enter city or address"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="radius">
                    Search Radius: {radius[0]} km
                  </Label>
                  <Slider
                    id="radius"
                    value={radius}
                    onValueChange={setRadius}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Searching...' : 'Search Stations'}
                </Button>
              </CardContent>
            </Card>


            {/* Results */}
            {stations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Found {stations.length} stations
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Feature coming soon')}
                  >
                    Filter
                  </Button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stations.map((station) => {
                    const status = getStationStatus(station)
                    const isBestStation = station.is_selected || station.isSelected
                    return (
                      <Card 
                        key={station.id} 
                        className={`bg-white/90 backdrop-blur-sm ${isBestStation ? 'ring-2 ring-orange-500 border-orange-200' : ''}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-base">{station.name}</CardTitle>
                                {isBestStation && (
                                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <CardDescription className="flex items-center mt-1 text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {station.address}
                              </CardDescription>
                            </div>
                            <div className="text-right ml-2">
                              <div className={`text-xs font-medium ${status.color}`}>
                                {status.status}
                              </div>
                              <div className="text-xs text-gray-500">
                                {station.distance.toFixed(1)} km
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {/* Chargers */}
                            <div>
                              <div className="space-y-1">
                                {station.chargers.map((charger, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs">
                                    <span className="flex items-center">
                                      <Zap className="w-3 h-3 mr-1" />
                                      {charger.type} ({charger.power}kW)
                                    </span>
                                    <span className="text-gray-600">
                                      {charger.available}/{charger.count}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-1 pt-2">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                                onClick={() => openGoogleMaps(station)}
                              >
                                <MapPin className="w-3 h-3 mr-1" />
                                Navigate
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                                <Clock className="w-3 h-3 mr-1" />
                                Wait
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {stations.length === 0 && !loading && (
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="text-center py-8">
                  <Battery className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    No stations found
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Try searching in a different location
                  </p>
                  <Button onClick={handleSearch} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Search className="w-3 h-3 mr-1" />
                    Search Again
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right side - Empty for now, could add more controls */}
        <div className="flex-1"></div>
      </div>
    </div>
  )
}
