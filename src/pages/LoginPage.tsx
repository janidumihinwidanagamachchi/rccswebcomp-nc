import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Shell } from '@/components/layout/Shell'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { loginSchema, type LoginFormData } from '@/lib/validators'

export function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })
  const email = watch('email')

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    setNeedsConfirmation(false)
    setResendStatus('idle')
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
        setNeedsConfirmation(true)
      }
      setError(error.message)
      return
    }

    await useAuthStore.getState().refreshProfile()
    const { isAdmin } = useAuthStore.getState()
    navigate(isAdmin ? '/admin' : '/')
  }

  const handleResend = async () => {
    if (!email) return
    setResendStatus('idle')
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}` },
    })
    if (error) {
      setResendStatus('error')
      setError(error.message)
    } else {
      setResendStatus('sent')
    }
  }

  return (
    <Shell>
      <div className="container mx-auto flex max-w-md flex-col items-center justify-center px-4 py-16">
        <Link to="/" className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <Ticket className="h-8 w-8 text-brand" />
          RCCSWebComp-NC
        </Link>
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@school.edu" {...register('email')} />
                {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-quiet-ink"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              {needsConfirmation && (
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                  <p className="mb-2">Your email hasn&apos;t been confirmed yet.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResend}
                    disabled={resendStatus === 'sent'}
                  >
                    {resendStatus === 'sent' ? 'Confirmation email sent' : 'Resend confirmation email'}
                  </Button>
                  {resendStatus === 'error' && (
                    <p className="mt-2 text-danger">Failed to resend. Try again.</p>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-quiet-ink">
              Don&apos;t have an account?{' '}
              <Link to="/auth/register" className="font-medium text-brand hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
