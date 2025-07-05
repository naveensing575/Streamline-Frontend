import { useNavigate } from "react-router-dom"
import useAuth from "@/hooks/useAuth"
import RegisterForm from "@/components/RegisterForm"
import { toast } from "sonner"

export default function Register() {
  const { handleRegister } = useAuth()
  const navigate = useNavigate()

  const onRegister = async (name: string, email: string, password: string) => {
    try {
      await handleRegister(name, email, password)
      navigate("/") // Go to Dashboard after successful register
    } catch (err: any) {
      console.error(err.response?.data?.message)
      toast.error(err.response?.data?.message) 
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <RegisterForm onSubmit={onRegister} />
    </div>
  )
}
