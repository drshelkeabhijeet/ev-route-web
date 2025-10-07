'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SignupSuccessPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5efd5,transparent)]"></div></div>
      
      <Card className="w-full max-w-md shadow-2xl border-green-100 dark:border-green-900/50">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Mail className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription className="text-balance">
            We've sent you a verification link to complete your registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Step 1: Check your inbox</p>
                <p className="text-sm text-gray-600">Look for an email from EV Route</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Step 2: Click the verification link</p>
                <p className="text-sm text-gray-600">This will confirm your email address</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Step 3: Start planning routes</p>
                <p className="text-sm text-gray-600">You'll be redirected to the dashboard</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Didn't receive the email?</strong> Check your spam folder or try signing up again.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
            
            <Link href="/signup" className="w-full">
              <Button variant="ghost" className="w-full">
                Try Different Email
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
