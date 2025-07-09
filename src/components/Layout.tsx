import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"
import useAuth from "@/hooks/useAuth"

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <>
      <Navbar user={user!} logout={logout} />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  )
}
