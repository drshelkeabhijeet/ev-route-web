'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to transform Supabase user to our User type
const transformSupabaseUser = (supabaseUser: SupabaseUser): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email || '',
  name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || '',
  avatar: supabaseUser.user_metadata?.avatar_url || '',
  createdAt: supabaseUser.created_at,
  updatedAt: supabaseUser.updated_at || supabaseUser.created_at
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn('⚠️ Supabase not configured. Authentication will not work until you add credentials to .env.local')
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(transformSupabaseUser(session.user))
        }
      } catch (error) {
        console.error('Failed to get session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)
        
        try {
          if (event === 'TOKEN_REFRESHED' && session?.user) {
            setUser(transformSupabaseUser(session.user))
          } else if (event === 'SIGNED_IN' && session?.user) {
            setUser(transformSupabaseUser(session.user))
          } else if (event === 'SIGNED_OUT') {
            setUser(null)
            // Clear all localStorage data including cached stations
            if (typeof window !== 'undefined') {
              localStorage.removeItem('ev-route-cached-stations')
              localStorage.removeItem('ev-route-has-searched')
            }
          }
        } catch (error) {
          console.error('Auth state change error:', error)
          // If there's an error with token refresh, sign out the user
          if (event === 'TOKEN_REFRESHED') {
            await handleTokenRefreshError()
          }
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [isSupabaseConfigured])

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add your credentials to .env.local file.')
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Provide more user-friendly error messages
        let errorMessage = error.message
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid login credentials'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email not confirmed'
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many requests'
        }
        
        throw new Error(errorMessage)
      }

      if (data.user) {
        setUser(transformSupabaseUser(data.user))
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const loginWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add your credentials to .env.local file.')
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) {
        // Provide helpful error messages
        if (error.message.includes('not enabled') || error.message.includes('Unsupported provider')) {
          throw new Error('Google sign-in is not enabled. Please enable the Google provider in your Supabase project settings (Authentication > Providers > Google).')
        }
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add your credentials to .env.local file. See SUPABASE_SETUP.md for instructions.')
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name: name,
          }
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation is required - user needs to verify their email
        throw new Error('Please check your email and click the verification link to complete your registration.')
      }

      if (data.user && data.session) {
        // User is immediately confirmed (email confirmation disabled)
        setUser(transformSupabaseUser(data.user))
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      
      // Clear all localStorage data including cached stations
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ev-route-cached-stations')
        localStorage.removeItem('ev-route-has-searched')
      }
      
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Still redirect to login even if logout fails
      router.push('/login')
    }
  }

  // Handle token refresh errors
  const handleTokenRefreshError = async () => {
    console.log('Token refresh failed, signing out user')
    setUser(null)
    
    // Clear all localStorage data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ev-route-cached-stations')
      localStorage.removeItem('ev-route-has-searched')
    }
    
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}