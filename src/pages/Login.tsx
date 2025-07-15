import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '@/features/useAuth'
import LoginForm from '@/components/LoginForm'
import { toast } from 'sonner'

const Login = () => {
  const [loginUser] = useLoginMutation()
  const navigate = useNavigate()

  const onLogin = async (email: string, password: string) => {
    try {
      const res = await loginUser({ email, password }).unwrap()
      localStorage.setItem('token', res.token)
      const user = email.split('@')[0]
      toast.success(`Welcome back ${user} 👋`)
      navigate('/')
    } catch (err: any) {
      console.error(err)
      toast.error(err?.data?.message || 'Login failed.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm onSubmit={onLogin} />
    </div>
  )
}

export default Login
