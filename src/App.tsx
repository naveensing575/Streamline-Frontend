import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Kanban from "@/pages/Kanban";
import Timeline from "@/pages/Timeline";
import Inventory from "@/pages/Inventory";
import Logistics from "@/pages/Logistics";
import NotFound from "@/pages/NotFound";
import ManageUsers from "@/pages/ManageUsers";
import Profile from "@/pages/Profile";
import PrivateRoute from "@/components/PrivateRoute";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
