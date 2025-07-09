import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "@/pages/Register"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import NotFound from "@/pages/NotFound"
import ManageUsers from "@/pages/ManageUsers"
import PrivateRoute from "@/components/PrivateRoute"
import Layout from "@/components/Layout"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
