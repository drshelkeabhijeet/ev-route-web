'use client'

import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { ChargingStation } from '@/lib/types'

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface MapProps {
  center?: [number, number]
  zoom?: number
  className?: string
  stations?: ChargingStation[]
  route?: any
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

export default function Map({
  center = [37.7749, -122.4194], // Default to San Francisco
  zoom = 13,
  className = 'h-[600px] w-full rounded-lg',
  stations = []
}: MapProps) {
  // Create custom icon for charging stations
  const chargingIcon = L.divIcon({
    html: `
      <div class="relative">
        <div class="absolute -top-8 -left-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#10b981" stroke="#fff" stroke-width="2"/>
            <path d="M13 7L9 12H12L11 17L15 12H12L13 7Z" fill="white"/>
          </svg>
        </div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      style={{ zIndex: 0 }}
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Current location marker */}
      <Marker position={center}>
        <Popup>
          <div className="text-sm">
            <p className="font-semibold">Your Location</p>
          </div>
        </Popup>
      </Marker>

      {/* Charging station markers */}
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={[station.location.lat, station.location.lng]}
          icon={chargingIcon}
        >
          <Popup>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{station.name}</p>
              <p className="text-gray-600">{station.address}</p>
              <div className="pt-2">
                {station.chargers.map((charger, idx) => (
                  <div key={idx} className="text-xs">
                    {charger.type}: {charger.power}kW ({charger.available}/{charger.count})
                  </div>
                ))}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}