import type { User } from "@/types/User"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

interface NavbarProps {
  user: User
  logout: () => void
}

export default function Navbar({ user, logout }: NavbarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success("👋 Logged out successfully.")
    navigate("/login")
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b">
      <Link to="/" className="text-xl font-bold">
        TaskFlowAI
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">Hello, {user?.name}</span>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  )
}
