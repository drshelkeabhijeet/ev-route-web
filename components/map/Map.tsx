'use client'

import { useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { ChargingStation } from '@/lib/types'

// Simple polyline decoder function
function decodePolyline(encoded: string): google.maps.LatLng[] {
  const poly = []
  let index = 0
  const len = encoded.length
  let lat = 0
  let lng = 0

  while (index < len) {
    let b: number
    let shift = 0
    let result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1))
    lat += dlat

    shift = 0
    result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1))
    lng += dlng

    poly.push(new google.maps.LatLng(lat / 1e5, lng / 1e5))
  }
  return poly
}

interface MapProps {
  center?: [number, number]
  zoom?: number
  className?: string
  stations?: ChargingStation[]
  route?: {
    polyline?: string
    distance_km?: number
    duration_minutes?: number
    origin?: string
    destination?: string
  }
  onStationClick?: (station: ChargingStation) => void
  showRadius?: boolean
  radiusKm?: number
  selectedStationId?: string
}

// Google Maps component
function GoogleMapComponent({
  center = [37.7749, -122.4194],
  zoom = 13,
  className = 'h-[600px] w-full rounded-lg',
  stations = [],
  route,
  onStationClick,
  showRadius = false,
  radiusKm = 15,
  selectedStationId
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null)
  const [radiusCircle, setRadiusCircle] = useState<google.maps.Circle | null>(null)

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: center[0], lng: center[1] },
        zoom: zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        clickableIcons: true,
        gestureHandling: 'greedy',
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })
      setMap(newMap)
    }
  }, [mapRef, map, center, zoom])

  // Update map center when center prop changes
  useEffect(() => {
    if (map && center) {
      map.setCenter({ lat: center[0], lng: center[1] })
    }
  }, [map, center])

  // Update radius circle when showRadius or radiusKm changes
  useEffect(() => {
    if (!map) return

    // Clear existing circle
    if (radiusCircle) {
      radiusCircle.setMap(null)
    }

    // Create new circle if showRadius is true
    if (showRadius && center) {
      const newCircle = new google.maps.Circle({
        map: map,
        center: { lat: center[0], lng: center[1] },
        radius: radiusKm * 1000, // Convert km to meters
        strokeColor: '#10b981',
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: '#10b981',
        fillOpacity: 0.1,
        clickable: false
      })
      setRadiusCircle(newCircle)
    }

    // Cleanup function
    return () => {
      if (radiusCircle) {
        radiusCircle.setMap(null)
      }
    }
  }, [map, showRadius, radiusKm, center])

  // Update markers when stations change
  useEffect(() => {
    if (!map) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    const newMarkers: google.maps.Marker[] = []

    // Add station markers
    stations.forEach((station) => {
      const isBestStation = station.is_selected || station.isSelected || station.id === selectedStationId
      
      const marker = new google.maps.Marker({
        position: { lat: station.location.lat, lng: station.location.lng },
        map: map,
        clickable: true,
        optimized: false,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="${isBestStation ? '#f97316' : '#10b981'}" stroke="#fff" stroke-width="2"/>
              <path d="M13 7L9 12H12L11 17L15 12H12L13 7Z" fill="white"/>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        },
        title: station.name,
        cursor: 'pointer'
      })

      // Add click listener - only trigger callback, no info window
      marker.addListener('click', () => {
        if (onStationClick) {
          onStationClick(station)
        }
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    // Cleanup function
    return () => {
      newMarkers.forEach(marker => marker.setMap(null))
    }
  }, [map, stations, onStationClick, selectedStationId])

  // Update polyline when route changes
  useEffect(() => {
    if (!map || !route?.polyline) return

    // Clear existing polyline
    if (polyline) {
      polyline.setMap(null)
    }

    // Decode and create new polyline
    const decodedPath = decodePolyline(route.polyline)
    
    const newPolyline = new google.maps.Polyline({
      path: decodedPath,
      geodesic: true,
      strokeColor: '#3b82f6',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      icons: [{
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          strokeColor: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.8,
          scale: 3
        },
        offset: '50%',
        repeat: '200px'
      }]
    })

    newPolyline.setMap(map)
    setPolyline(newPolyline)

    // Fit map to route bounds
    if (decodedPath.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      decodedPath.forEach(point => bounds.extend(point))
      map.fitBounds(bounds)
      
      // Add some padding
      const listener = google.maps.event.addListener(map, 'bounds_changed', () => {
        const currentBounds = map.getBounds()
        if (currentBounds) {
          const ne = currentBounds.getNorthEast()
          const sw = currentBounds.getSouthWest()
          const latSpan = ne.lat() - sw.lat()
          const lngSpan = ne.lng() - sw.lng()
          
          const newBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(sw.lat() - latSpan * 0.1, sw.lng() - lngSpan * 0.1),
            new google.maps.LatLng(ne.lat() + latSpan * 0.1, ne.lng() + lngSpan * 0.1)
          )
          map.fitBounds(newBounds)
          google.maps.event.removeListener(listener)
        }
      })
    }

    // Cleanup function
    return () => {
      if (newPolyline) {
        newPolyline.setMap(null)
      }
    }
  }, [map, route?.polyline])

  // Add origin and destination markers
  useEffect(() => {
    if (!map || !route) return

    const routeMarkers: google.maps.Marker[] = []

    // Origin marker
    if (route.origin) {
      const originCoords = route.origin.split(',').map(Number)
      const originMarker = new google.maps.Marker({
        position: { lat: originCoords[0], lng: originCoords[1] },
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="#10b981" stroke="#fff" stroke-width="3"/>
              <text x="10" y="14" text-anchor="middle" fill="white" font-size="10" font-weight="bold">S</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(20, 20),
          anchor: new google.maps.Point(10, 10)
        },
        title: 'Start'
      })
      routeMarkers.push(originMarker)
    }

    // Destination marker
    if (route.destination) {
      const destCoords = route.destination.split(',').map(Number)
      const destMarker = new google.maps.Marker({
        position: { lat: destCoords[0], lng: destCoords[1] },
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="#ef4444" stroke="#fff" stroke-width="3"/>
              <text x="10" y="14" text-anchor="middle" fill="white" font-size="10" font-weight="bold">E</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(20, 20),
          anchor: new google.maps.Point(10, 10)
        },
        title: 'End'
      })
      routeMarkers.push(destMarker)
    }

    // Clean up markers on unmount
    return () => {
      routeMarkers.forEach(marker => marker.setMap(null))
    }
  }, [map, route?.origin, route?.destination])

  return <div ref={mapRef} className={className} />
}

// Loading component
const LoadingComponent = () => (
  <div className="h-[600px] w-full rounded-lg bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-gray-600">Loading map...</p>
    </div>
  </div>
)

// Error component
const ErrorComponent = () => (
  <div className="h-[600px] w-full rounded-lg bg-red-50 flex items-center justify-center">
    <div className="text-center">
      <p className="text-red-600">Error loading map. Please check your API key.</p>
    </div>
  </div>
)

// Main Map component with Google Maps wrapper
export default function Map(props: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    return (
      <div className="h-[600px] w-full rounded-lg bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-yellow-800 mb-2">Google Maps API key not configured</p>
          <p className="text-sm text-yellow-600">Please add your API key to .env.local</p>
          <p className="text-xs text-yellow-500 mt-2">
            Current API Key: {apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Wrapper
      apiKey={apiKey}
      render={render}
      libraries={['places']}
    />
  )

  function render(status: Status) {
    switch (status) {
      case Status.LOADING:
        return <LoadingComponent />
      case Status.FAILURE:
        return <ErrorComponent />
      case Status.SUCCESS:
        return <GoogleMapComponent {...props} />
    }
  }
}