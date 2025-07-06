import { useNavigate } from "react-router-dom"
import useAuth from "@/hooks/useAuth"
import LoginForm from "@/components/LoginForm"
import { toast } from "sonner"

const Login = () => {
  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  const onLogin = async (email: string, password: string) => {
    const user = email.split('@')[0]
    try {
      await handleLogin(email, password)
      toast.success(`Welcome back ${user} 👋`)
      navigate("/")
    } catch (err: any) {
      console.error(err.response?.data?.message)
      toast.error(err.response?.data?.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm onSubmit={onLogin} />
    </div>
  )
}

export default Login
