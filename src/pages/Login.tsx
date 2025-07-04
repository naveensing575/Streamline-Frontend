import { useNavigate } from "react-router-dom"
import useAuth from "@/hooks/useAuth"
import LoginForm from "@/components/LoginForm"

const Login = () => {
  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  const onLogin = async (email: string, password: string) => {
    try {
      await handleLogin(email, password)
      navigate("/")
    } catch (err) {
      console.error(err)
      // TODO: Show error toast
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm onSubmit={onLogin} />
    </div>
  )
}

export default Login
