import { LoginForm, RegisterForm, AuthLayout } from '../components/auth/AuthForms'

export function LoginPage() {
  return (
    <AuthLayout
      title="Karibu Tena"
      subtitle="Sign in to access your bookings and explore Kenya's finest stays"
    >
      <LoginForm />
    </AuthLayout>
  )
}

export function RegisterPage() {
  return (
    <AuthLayout
      title="Jiunge Nasi"
      subtitle="Join thousands of travellers enjoying premium Kenyan hospitality"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
