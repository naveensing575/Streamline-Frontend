import { useNavigate } from "react-router-dom"
import useAuth from "@/hooks/useAuth"
import RegisterForm from "@/components/RegisterForm"

export default function Register() {
  const { handleRegister } = useAuth()
  const navigate = useNavigate()

  const onRegister = async (name: string, email: string, password: string) => {
    try {
      await handleRegister(name, email, password)
      navigate("/") // Go to Dashboard after successful register
    } catch (err) {
      console.error(err)
      // TODO: Show error toast
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <RegisterForm onSubmit={onRegister} />
    </div>
  )
}
