import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { loginSchema, type LoginFormValues } from './Authorization.schema'
import { authorizationTokens as tokens } from './Authorization.tokens'
import { toast } from '@/_shared'
import { useAuth } from '@/services'
import { Button, Input, Text } from '@/ui'

type Props = {
  onForgotPasswordClick?: () => void
}

export const Authorization = ({ onForgotPasswordClick }: Props) => {
  const { login, isLoggingIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@example.com', password: 'demo123' },
  })

  const onSubmit = (values: LoginFormValues) => {
    login(values, {
      onError: () => toast.error('Invalid credentials'),
    })
  }

  return (
    <div className={tokens.wrapper}>
      <div className={tokens.heading}>
        <h1 className={tokens.title}>Welcome back</h1>
        <Text className={tokens.subtitle}>Sign in to your account</Text>
      </div>

      <Text className={tokens.hint}>
        Demo mode — any email/password works. Pre-filled for convenience.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)} className={tokens.form}>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        {onForgotPasswordClick && (
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className={tokens.forgot}
          >
            Forgot password?
          </button>
        )}
        <Button
          type="submit"
          isLoading={isLoggingIn}
          classNames={{ base: 'w-full' }}
        >
          Sign in
        </Button>
      </form>
    </div>
  )
}
