import axios from 'axios'
import { AuthResponse, LoginRequest, SignupRequest, RouteResponse } from '@/lib/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://abhijeetshelke.app.n8n.cloud'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/webhook/auth/login', data)
    return response.data
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/webhook/auth/signup', data)
    return response.data
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
}

// Route API
export const routeAPI = {
  planRoute: async (data: {
    origin: { lat: number; lng: number }
    destination: { lat: number; lng: number }
    vehicleId: string
    currentBattery: number
  }): Promise<RouteResponse> => {
    const response = await apiClient.post('/webhook/route/plan', data)
    return response.data
  },

  getNearbyStations: async (lat: number, lng: number, radius: number = 50) => {
    const response = await apiClient.get('/webhook/stations/nearby', {
      params: { lat, lng, radius }
    })
    return response.data
  },
}

// Mock API for development (remove when backend is ready)
export const mockAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (data.email && data.password) {
      return {
        user: {
          id: '1',
          email: data.email,
          name: data.email.split('@')[0],
        },
        token: 'mock-jwt-token-' + Date.now(),
      }
    }
    throw new Error('Invalid credentials')
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (data.email && data.password && data.name) {
      return {
        user: {
          id: '1',
          email: data.email,
          name: data.name,
        },
        token: 'mock-jwt-token-' + Date.now(),
      }
    }
    throw new Error('Invalid data')
  },
}