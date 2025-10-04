'use client'

import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { ChargingStation } from '@/lib/types'

// Fix for default markers in Next.js - use custom SVG icons
const defaultIcon = L.divIcon({
  html: `
    <div style="
      background-color: #3388ff;
      width: 25px;
      height: 41px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      <div style="
        transform: rotate(45deg);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">📍</div>
    </div>
  `,
  className: 'custom-div-icon',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface MapProps {
  center?: [number, number]
  zoom?: number
  className?: string
  stations?: ChargingStation[]
  route?: any
  onStationClick?: (station: ChargingStation) => void
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
  stations = [],
  onStationClick
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

  // Create orange icon for best/recommended stations
  const bestStationIcon = L.divIcon({
    html: `
      <div class="relative">
        <div class="absolute -top-8 -left-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#f97316" stroke="#fff" stroke-width="2"/>
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
      <Marker position={center} icon={defaultIcon}>
        <Popup>
          <div className="text-sm">
            <p className="font-semibold">Your Location</p>
          </div>
        </Popup>
      </Marker>

      {/* Charging station markers */}
      {stations.map((station) => {
        const isBestStation = station.is_selected || station.isSelected
        return (
          <Marker
            key={station.id}
            position={[station.location.lat, station.location.lng]}
            icon={isBestStation ? bestStationIcon : chargingIcon}
            eventHandlers={{
              click: () => {
                if (onStationClick) {
                  onStationClick(station)
                }
              }
            }}
          >
            <Popup>
              <div className="text-sm space-y-2 min-w-[200px]">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{station.name}</p>
                  {isBestStation && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-xs">{station.address}</p>
                <div className="pt-2 space-y-1">
                  {station.chargers.map((charger, idx) => (
                    <div key={idx} className="text-xs flex justify-between">
                      <span>{charger.type}</span>
                      <span className="text-gray-600">{charger.power}kW ({charger.available}/{charger.count})</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t">
                  <button
                    onClick={() => {
                      const { lat, lng } = station.location
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
                      window.open(url, '_blank')
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                  >
                    Navigate
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}