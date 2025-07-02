import { useState, useEffect } from "react"
import { registerUser, loginUser, getMe } from "@/api/authApi"
import type { User } from "@/types/User"

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch user when token exists
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }

    getMe()
      .then((data) => {
        setUser(data)
      })
      .catch(() => {
        // Token invalid → clear
        localStorage.removeItem("token")
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleRegister = async (name: string, email: string, password: string) => {
    const data = await registerUser({ name, email, password })
    localStorage.setItem("token", data.token)
    setUser(data)
  }

  const handleLogin = async (email: string, password: string) => {
    const data = await loginUser({ email, password })
    localStorage.setItem("token", data.token)
    setUser(data)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    logout,
  }
}
