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
  const [batteryCapacity, setBatteryCapacity] = useState([75])
  const [minSOC, setMinSOC] = useState([20])
  const [targetSOC, setTargetSOC] = useState([80])
  const [amenityPreferences, setAmenityPreferences] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number]>([37.7749, -122.4194])
  const [route, setRoute] = useState<any>(null)
  const [stations, setStations] = useState<any[]>([])
  const [selectedStation, setSelectedStation] = useState<any>(null)
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([])
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [originValid, setOriginValid] = useState(true)
  const [destinationValid, setDestinationValid] = useState(true)
  const [originCoords, setOriginCoords] = useState<string>('')
  const [destinationCoords, setDestinationCoords] = useState<string>('')

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [position.coords.latitude, position.coords.longitude]
          setUserLocation(newLocation)
          console.log('User location obtained:', newLocation)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Set a default location (Mumbai, India) if geolocation fails
          setUserLocation([19.0760, 72.8777])
          console.log('Using default location (Mumbai)')
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    } else {
      // Fallback if geolocation is not supported
      setUserLocation([19.0760, 72.8777])
      console.log('Geolocation not supported, using default location (Mumbai)')
    }
  }, [])

  // Fetch location suggestions using a simple geocoding approach
  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 3) return []
    
    try {
      setLoadingSuggestions(true)
      
      console.log('Fetching suggestions for:', query)
      
      // Check if Google Maps API key is available
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        console.warn('Google Maps API key not found, using fallback geocoding service')
        return await fetchLocationSuggestionsFallback(query)
      }
      
      // Use Google Geocoding API instead of Places API (more reliable)
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        console.error('Google Geocoding API Error:', response.status, response.statusText)
        console.log('Falling back to OpenStreetMap geocoding')
        return await fetchLocationSuggestionsFallback(query)
      }
      
      const data = await response.json()
      console.log('Google Geocoding Response:', data)
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Google Geocoding API Error:', data.status, data.error_message)
        console.log('Falling back to OpenStreetMap geocoding')
        return await fetchLocationSuggestionsFallback(query)
      }
      
      // Process geocoding results
      const results = data.results.map((result: any) => ({
        display_name: result.formatted_address,
        name: result.formatted_address.split(',')[0],
        lat: result.geometry?.location?.lat,
        lon: result.geometry?.location?.lng,
        place_id: result.place_id,
        types: result.types,
        formatted_address: result.formatted_address
      }))
      
      console.log('Processed results:', results.length)
      return results.slice(0, 5) // Limit to 5 results
    } catch (error) {
      console.error('Error fetching location suggestions:', error)
      console.log('Falling back to OpenStreetMap geocoding')
      return await fetchLocationSuggestionsFallback(query)
    } finally {
      setLoadingSuggestions(false)
    }
  }

  // Fallback geocoding service using OpenStreetMap Nominatim
  const fetchLocationSuggestionsFallback = async (query: string) => {
    try {
      console.log('Using fallback geocoding service for:', query)
      
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'EV-Route-Web/1.0'
        }
      })
      
      if (!response.ok) {
        console.error('Fallback geocoding error:', response.status)
        return []
      }
      
      const data = await response.json()
      console.log('Fallback geocoding response:', data)
      
      const results = data.map((place: any) => ({
        display_name: place.display_name,
        name: place.name || place.display_name.split(',')[0],
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
        place_id: place.place_id,
        types: [place.type, place.class],
        formatted_address: place.display_name
      }))
      
      console.log('Fallback processed results:', results.length)
      return results
    } catch (error) {
      console.error('Fallback geocoding error:', error)
      return []
    }
  }

  const handleOriginChange = async (value: string) => {
    setOrigin(value)
    setOriginValid(true) // Reset validation on change
    
    if (value.length >= 3) {
      const suggestions = await fetchLocationSuggestions(value)
      setOriginSuggestions(suggestions)
      setShowOriginSuggestions(suggestions.length > 0)
    } else {
      setOriginSuggestions([])
      setShowOriginSuggestions(false)
    }
  }

  const handleDestinationChange = async (value: string) => {
    setDestination(value)
    setDestinationValid(true) // Reset validation on change
    
    if (value.length >= 3) {
      const suggestions = await fetchLocationSuggestions(value)
      setDestinationSuggestions(suggestions)
      setShowDestinationSuggestions(suggestions.length > 0)
    } else {
      setDestinationSuggestions([])
      setShowDestinationSuggestions(false)
    }
  }

  const validateLocation = (location: string): boolean => {
    // Check if location is not empty and has reasonable length
    if (!location || location.trim().length < 2) return false
    
    // Check if it looks like a valid location (has letters and possibly numbers/commas)
    const locationPattern = /^[a-zA-Z0-9\s,.-]+$/
    return locationPattern.test(location)
  }

  const handlePlanRoute = async () => {
    // Validate locations
    const isOriginValid = validateLocation(origin)
    const isDestinationValid = validateLocation(destination)
    
    setOriginValid(isOriginValid)
    setDestinationValid(isDestinationValid)
    
    if (!origin || !destination) {
      toast.error('Please enter both origin and destination')
      return
    }
    
    if (!isOriginValid || !isDestinationValid) {
      toast.error('Please enter valid location names')
      return
    }

    if (!originCoords || !destinationCoords) {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        toast.error('Google Places API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local')
      } else {
        toast.error('Please select locations from the autocomplete suggestions')
      }
      return
    }

    setLoading(true)
    try {
      console.log('Planning route from:', origin, 'to:', destination)
      console.log('Origin coordinates:', originCoords)
      console.log('Destination coordinates:', destinationCoords)
      
      // Call n8n webhook for route planning
      const response = await routeAPI.planRoute(
        originCoords, // Send coordinates directly
        destinationCoords, // Send coordinates directly
        batteryLevel[0], // current_soc
        batteryCapacity[0], // battery_capacity_kwh
        minSOC[0], // min_soc
        targetSOC[0], // target_soc
        amenityPreferences // amenity_preferences
      )
      
      console.log('Route planning response:', response)
      
      // Transform the n8n response to match our RouteResponse interface
      console.log('Full response structure:', JSON.stringify(response, null, 2))
      console.log('Response type:', typeof response)
      console.log('Response length:', response?.length || 'N/A')
      
      // Handle empty or invalid responses
      if (!response || response === '' || response === '""' || (typeof response === 'string' && response.trim() === '')) {
        console.log('Empty response from n8n webhook')
        toast.error('Route planning service returned empty response. Please try again.')
        return
      }
      
      // Handle different possible response formats from n8n
      let routeData = null
      
      if (response && response.route) {
        routeData = response.route
      } else if (response && response.data && response.data.route) {
        routeData = response.data.route
      } else if (response && response.segments) {
        // Direct route data
        routeData = response
      } else if (response && response.data) {
        // Response wrapped in data
        routeData = response.data
      } else {
        console.log('Unexpected response format')
        throw new Error('Invalid response format from route planning API')
      }
      
      if (routeData) {
        // Ensure route data has the expected structure
        const processedRouteData = {
          ...routeData,
          distance_km: routeData.distance_km || routeData.route?.distance_km,
          duration_minutes: routeData.duration_minutes || routeData.route?.duration_minutes,
          polyline: routeData.polyline || routeData.route?.polyline,
          origin: routeData.origin || routeData.route?.origin,
          destination: routeData.destination || routeData.route?.destination
        }
        setRoute(processedRouteData)
        
        // Extract ALL stations from the response (both selected and all_stations)
        let allStationsData: any[] = []
        
        // Add all stations from all_stations array
        if (routeData.charging_plan?.all_stations) {
          const allStations = routeData.charging_plan.all_stations
            .map((station: any, index: number) => {
              const latRaw = station.lat ?? station.latitude ?? station.location?.latitude
              const lngRaw = station.lng ?? station.longitude ?? station.lon ?? station.location?.longitude ?? station.location?.lon
              const lat = typeof latRaw === 'string' ? parseFloat(latRaw) : latRaw
              const lng = typeof lngRaw === 'string' ? parseFloat(lngRaw) : lngRaw
              if (typeof lat !== 'number' || isNaN(lat) || typeof lng !== 'number' || isNaN(lng)) {
                console.warn('Invalid coordinates for station:', station.name, { latRaw, lngRaw })
                return null
              }
              return {
                id: station.id || `all_${index}`,
                name: station.name || station.station_name || `Station ${index + 1}`,
                location: { lat, lng },
                address: station.address || station.formatted_address || 'Address not available',
                chargers: station.chargers || [{
                  type: 'DC Fast',
                  power: station.power || station.charging_speed_kw || 50,
                  count: station.count || station.connector_count || 1,
                  available: station.available || 1
                }],
                amenities: station.amenities || [],
                is_selected: station.is_selected || false,
                rating: station.rating || 0,
                distance: station.distance_from_origin_km,
                wait_time: station.time_impact_minutes,
                charging_time: station.charging_time_minutes || station.charging_duration_minutes
              }
            })
            .filter(Boolean)
          allStationsData = [...(allStations as any[])]
          console.log('Processed all stations:', allStationsData.length, allStationsData)
        }
        
        // Add selected stations with enhanced data
        if (routeData.charging_plan?.selected_stations) {
          const selectedStations = routeData.charging_plan.selected_stations
            .map((station: any, index: number) => {
              const latRaw = station.lat ?? station.latitude ?? station.location?.latitude
              const lngRaw = station.lng ?? station.longitude ?? station.lon ?? station.location?.longitude ?? station.location?.lon
              const lat = typeof latRaw === 'string' ? parseFloat(latRaw) : latRaw
              const lng = typeof lngRaw === 'string' ? parseFloat(lngRaw) : lngRaw
              if (typeof lat !== 'number' || isNaN(lat) || typeof lng !== 'number' || isNaN(lng)) {
                return null
              }
              return {
                id: station.id || `selected_${index}`,
                name: station.name || station.station_name || `Selected Station ${index + 1}`,
                location: { lat, lng },
                address: station.address || station.formatted_address || 'Address not available',
                chargers: station.chargers || [{
                  type: 'DC Fast',
                  power: station.power || station.charging_speed_kw || 50,
                  count: station.count || station.connector_count || 1,
                  available: station.available || 1
                }],
                amenities: station.amenities || [],
                is_selected: true, // These are selected stations
                rating: station.rating || 0,
                distance: station.distance_from_origin_km,
                wait_time: station.time_impact_minutes,
                charging_time: station.charging_time_minutes || station.charging_duration_minutes
              }
            })
            .filter(Boolean) as any[]
          
          // Merge selected stations with all stations, updating existing ones
          selectedStations.forEach(selectedStation => {
            const existingIndex = allStationsData.findIndex(station => 
              station.location.lat === selectedStation.location.lat && 
              station.location.lng === selectedStation.location.lng
            )
            if (existingIndex >= 0) {
              // Update existing station to mark as selected
              allStationsData[existingIndex] = { ...allStationsData[existingIndex], ...selectedStation, is_selected: true }
            } else {
              // Add new selected station
              allStationsData.push(selectedStation)
            }
          })
        }
        
        console.log(`Found ${allStationsData.length} total stations, ${allStationsData.filter(s => s.is_selected).length} selected`)
        console.log('Final stations data:', allStationsData)
        
        // Debug: Log each station's coordinates
        allStationsData.forEach((station, idx) => {
          console.log(`Station ${idx + 1}: ${station.name}`, {
            lat: station.location.lat,
            lng: station.location.lng,
            is_selected: station.is_selected
          })
        })
        
        console.log('Setting stations state with:', allStationsData.length, 'stations')
        setStations(allStationsData)
        
        toast.success(`Route planned successfully! Found ${allStationsData.length} charging stations.`)
      } else {
        throw new Error('No route data found in response')
      }
    } catch (error: any) {
      console.error('Error planning route:', error)
      
      // Show specific error messages
      if (error.response?.status === 500) {
        toast.error('Server error (500): The route planning service may have an issue.')
      } else if (error.response?.status === 404) {
        toast.error('Route planning service not found (404): Check the webhook URL.')
      } else if (error.response?.status === 400) {
        toast.error('Bad request (400): Check the route parameters.')
      } else {
        toast.error(`Failed to plan route: ${error.message || 'Unknown error'}`)
      }
      
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
                <Label htmlFor="origin">Origin</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="origin"
                    placeholder="Enter city, address, or landmark (min 3 characters)"
                    value={origin}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    onFocus={() => {
                      if (origin.length >= 3 && originSuggestions.length > 0) {
                        setShowOriginSuggestions(true)
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
                    className={`pl-10 ${!originValid ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {!originValid && (
                    <p className="text-xs text-red-500 mt-1">Please enter a valid location</p>
                  )}
                  {loadingSuggestions && origin.length >= 3 && (
                    <div className="absolute right-3 top-2.5">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    </div>
                  )}
                  {showOriginSuggestions && originSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                      <div className="px-3 py-2 text-xs font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-700">
                        {originSuggestions.length} location{originSuggestions.length !== 1 ? 's' : ''} found
                      </div>
                      {originSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full px-3 py-2.5 text-left hover:bg-green-50 dark:hover:bg-green-900/20 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                          onClick={() => {
                            setOrigin(suggestion.display_name)
                            setOriginCoords(`${suggestion.lat},${suggestion.lon}`)
                            setOriginValid(true)
                            setShowOriginSuggestions(false)
                          }}
                        >
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-gray-900 dark:text-gray-100 font-medium truncate">
                                {suggestion.name || suggestion.display_name.split(',')[0]}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {suggestion.formatted_address || suggestion.display_name}
                              </div>
                              {suggestion.types && suggestion.types.length > 0 && (
                                <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                                  {suggestion.types.slice(0, 2).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="destination"
                    placeholder="Enter city, address, or landmark (min 3 characters)"
                    value={destination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    onFocus={() => {
                      if (destination.length >= 3 && destinationSuggestions.length > 0) {
                        setShowDestinationSuggestions(true)
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                    className={`pl-10 ${!destinationValid ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {!destinationValid && (
                    <p className="text-xs text-red-500 mt-1">Please enter a valid location</p>
                  )}
                  {loadingSuggestions && destination.length >= 3 && (
                    <div className="absolute right-3 top-2.5">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    </div>
                  )}
                  {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                      <div className="px-3 py-2 text-xs font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-700">
                        {destinationSuggestions.length} location{destinationSuggestions.length !== 1 ? 's' : ''} found
                      </div>
                      {destinationSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full px-3 py-2.5 text-left hover:bg-green-50 dark:hover:bg-green-900/20 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                          onClick={() => {
                            setDestination(suggestion.display_name)
                            setDestinationCoords(`${suggestion.lat},${suggestion.lon}`)
                            setDestinationValid(true)
                            setShowDestinationSuggestions(false)
                          }}
                        >
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-gray-900 dark:text-gray-100 font-medium truncate">
                                {suggestion.name || suggestion.display_name.split(',')[0]}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {suggestion.formatted_address || suggestion.display_name}
                              </div>
                              {suggestion.types && suggestion.types.length > 0 && (
                                <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                                  {suggestion.types.slice(0, 2).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
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

              <div className="space-y-2">
                <Label htmlFor="batteryCapacity">
                  Battery Capacity: {batteryCapacity[0]} kWh
                </Label>
                <div className="flex items-center space-x-3">
                  <Battery className="h-4 w-4 text-gray-400" />
                  <Slider
                    id="batteryCapacity"
                    value={batteryCapacity}
                    onValueChange={setBatteryCapacity}
                    max={200}
                    step={5}
                    min={20}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">kWh</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minSOC">
                  Minimum SOC: {minSOC[0]}%
                </Label>
                <div className="flex items-center space-x-3">
                  <Battery className="h-4 w-4 text-red-400" />
                  <Slider
                    id="minSOC"
                    value={minSOC}
                    onValueChange={setMinSOC}
                    max={50}
                    step={5}
                    min={5}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetSOC">
                  Target SOC: {targetSOC[0]}%
                </Label>
                <div className="flex items-center space-x-3">
                  <Battery className="h-4 w-4 text-green-400" />
                  <Slider
                    id="targetSOC"
                    value={targetSOC}
                    onValueChange={setTargetSOC}
                    max={100}
                    step={5}
                    min={50}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities">Amenity Preferences</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Restrooms', 'Food', 'WiFi', 'Shopping', 'Parking', 'Coffee'].map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={amenityPreferences.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAmenityPreferences([...amenityPreferences, amenity])
                          } else {
                            setAmenityPreferences(amenityPreferences.filter(a => a !== amenity))
                          }
                        }}
                        className="rounded"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handlePlanRoute}
                  disabled={loading || !origin || !destination}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Planning Route...' : 'Plan Route'}
                </Button>
                
              </div>
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
                    <span className="font-medium">{route.distance_km?.toFixed(1) || 0} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{route.duration_minutes || 0} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Stations Found:</span>
                    <span className="font-medium">{stations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Stations:</span>
                    <span className="font-medium text-orange-600">
                      {stations.filter(s => s.is_selected).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Stations:</span>
                    <span className="font-medium text-green-600">
                      {stations.filter(s => !s.is_selected).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Charging Time:</span>
                    <span className="font-medium">
                      {stations.filter(s => s.is_selected).reduce((total, station) => total + (station.charging_time || 0), 0)} min
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Station Details */}
          {selectedStation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Station Details</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedStation(null)}
                  >
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-green-600">{selectedStation.name}</h4>
                    <p className="text-sm text-gray-600">{selectedStation.address}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Charging Options:</h5>
                    {selectedStation.chargers.map((charger: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{charger.type}</span>
                        <span className="text-gray-600">{charger.power}kW ({charger.available}/{charger.count})</span>
                      </div>
                    ))}
                  </div>

                  {selectedStation.distance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Distance from route:</span>
                      <span className="font-medium">{selectedStation.distance} km</span>
                    </div>
                  )}

                  {selectedStation.charging_time && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Charging time:</span>
                      <span className="font-medium">{selectedStation.charging_time} min</span>
                    </div>
                  )}

                  {selectedStation.wait_time && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Wait time:</span>
                      <span className="font-medium">{selectedStation.wait_time} min</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      onClick={() => {
                        const { lat, lng } = selectedStation.location
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
                        window.open(url, '_blank')
                      }}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Navigate to Station
                    </Button>
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
              {stations.length > 0 && (
                <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Selected Stations ({stations.filter(s => s.is_selected).length})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Available Stations ({stations.filter(s => !s.is_selected).length})</span>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <Map
                key={stations.length > 0 ? JSON.stringify(stations[0].location) : 'no-stations'}
                center={userLocation} 
                zoom={13} 
                className="h-[600px] w-full"
                route={route}
                stations={stations}
                onStationClick={(station) => {
                  setSelectedStation(station)
                  console.log('Station clicked:', station)
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}