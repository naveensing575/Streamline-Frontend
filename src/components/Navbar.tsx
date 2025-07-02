import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Navbar({ user }: { user: any }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
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
