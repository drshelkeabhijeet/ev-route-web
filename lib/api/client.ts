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
  planRoute: async (
    originCoords: string, 
    destinationCoords: string, 
    batteryLevel: number = 80,
    batteryCapacity: number = 75,
    minSOC: number = 20,
    targetSOC: number = 80,
    amenityPreferences: string[] = []
  ) => {
    try {
      console.log('Planning route with n8n webhook:', { 
        originCoords, 
        destinationCoords, 
        batteryLevel, 
        batteryCapacity, 
        minSOC, 
        targetSOC, 
        amenityPreferences 
      })
      
      // Prepare request data in the exact format n8n expects
      const requestData = {
        origin: originCoords, // "latitude,longitude" format
        destination: destinationCoords, // "latitude,longitude" format
        current_soc: batteryLevel,
        battery_capacity_kwh: batteryCapacity,
        min_soc: minSOC,
        target_soc: targetSOC,
        amenity_preferences: amenityPreferences
      }
      
      console.log('Sending data to n8n webhook:', requestData)
      
      const response = await apiClient.post('/webhook/5c5cf1c2-edab-404e-8637-8e3c4a572f9d', requestData)
      
      console.log('Route planning response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Route planning error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      })
      throw error
    }
  }
}

// Stations API
export const stationsAPI = {
  getNearbyStations: async (lat: number, lng: number, radius: number = 10) => {
    try {
      console.log('Making API request to n8n webhook with:', { lat, lng, radius })
      
      const response = await apiClient.post('/webhook/545c8277-554b-460d-89c5-5785fb99c782', {
        latitude: lat,        // n8n expects 'latitude'
        longitude: lng,       // n8n expects 'longitude' 
        radius_km: radius     // n8n expects 'radius_km'
      })
      
      console.log('n8n webhook response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('n8n webhook error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      })
      throw error
    }
  },

  // Test function to debug the webhook
  testWebhook: async () => {
    try {
      console.log('Testing n8n webhook with minimal data...')
      
      const response = await apiClient.post('/webhook/545c8277-554b-460d-89c5-5785fb99c782', {
        latitude: 37.7749,    // n8n expects 'latitude'
        longitude: -122.4194,  // n8n expects 'longitude' 
        radius_km: 5          // n8n expects 'radius_km'
      })
      
      console.log('Test webhook response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Test webhook error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
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