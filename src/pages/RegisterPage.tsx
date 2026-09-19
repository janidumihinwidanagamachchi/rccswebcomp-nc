import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Shell } from '@/components/layout/Shell'
import { supabase } from '@/lib/supabase'
import { registerSchema, type RegisterFormData } from '@/lib/validators'

export function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const role = watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    setError(null)
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          role: data.role,
          grade: data.grade || null,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (authData.user) {
      navigate('/')
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
            <CardTitle>Create an account</CardTitle>
            <CardDescription>You&apos;ll need an account to register for events.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" {...register('fullName')} />
                {errors.fullName && <p className="text-xs text-danger">{errors.fullName.message}</p>}
              </div>
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
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="role">I am a</Label>
                <Select value={role} onValueChange={(v) => setValue('role', v as RegisterFormData['role'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-danger">{errors.role.message}</p>}
              </div>
              {role === 'student' && (
                <div className="space-y-1">
                  <Label htmlFor="grade">Grade</Label>
                  <Input id="grade" type="number" min={1} max={13} {...register('grade')} />
                </div>
              )}
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-quiet-ink">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-medium text-brand hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
