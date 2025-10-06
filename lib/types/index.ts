export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  batteryCapacity: number
  range: number
  efficiency: number
  chargingPower: number
  isSelected?: boolean
}

export interface ChargingStation {
  id: string
  name: string
  location: {
    lat: number
    lng: number
  }
  address: string
  chargers: {
    type: string
    power: number
    count: number
    available: number
  }[]
  amenities: string[]
  distance?: number
}

export interface RouteSegment {
  distance: number
  duration: number
  startLocation: {
    lat: number
    lng: number
  }
  endLocation: {
    lat: number
    lng: number
  }
  polyline: string
}

export interface ChargingStop {
  station: ChargingStation
  arrivalBattery: number
  departBattery: number
  chargingTime: number
  waitTime?: number
}

export interface RouteResponse {
  route: {
    segments: RouteSegment[]
    totalDistance: number
    totalDuration: number
    totalChargingTime: number
    chargingStops: ChargingStop[]
  }
  statistics: {
    energyConsumption: number
    co2Saved: number
    fuelCostSaved: number
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
}