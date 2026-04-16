import { LoginForm, RegisterForm, AuthLayout } from '../components/auth/AuthForms'

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your bookings and exclusive offers"
    >
      <LoginForm />
    </AuthLayout>
  )
}

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of travellers enjoying premium stays"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
