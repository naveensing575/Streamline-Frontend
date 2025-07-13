"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  KanbanSquare,
  CalendarRange,
  Package,
  Truck,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "@/assets/logo.svg";
import { toast } from "sonner";

export default function Sidebar() {
  const location = useLocation();

  const navLinks = [
    { path: "/", icon: LayoutDashboard },
    { path: "/kanban", icon: KanbanSquare },
    { path: "/timeline", icon: CalendarRange },
    { path: "/inventory", icon: Package },
    { path: "/logistics", icon: Truck },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <aside className="w-20 sm:w-24 bg-[#ECEFE9] flex flex-col justify-between items-center py-6 px-4">
      {/* Logo */}
      <div className="mb-4">
        <Link to="/" className="flex items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* Center Nav Icons */}
      <nav className="flex flex-col items-center gap-5 flex-1 justify-center">
        {navLinks.map(({ path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center justify-center p-2 rounded-lg ${
                isActive ? "bg-black text-white" : "text-gray-700"
              } hover:text-black`}
            >
              <Icon
                className={`${
                  isActive ? "text-white" : "text-gray-700"
                } h-4 w-4 sm:h-5 sm:w-5`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Bottom Settings & Logout */}
      <div className="flex flex-col items-center gap-5 mt-4 pb-4">
        <Link
          to="/admin/users"
          className={`flex items-center justify-center p-2 rounded-lg ${
            location.pathname === "/settings"
              ? "bg-black text-white"
              : "text-gray-700"
          } hover:text-black`}
        >
          <Settings
            className={`${
              location.pathname === "/admin/users" ? "text-white" : "text-gray-700"
            } h-4 w-4 sm:h-5 sm:w-5`}
          />
        </Link>

        <button
          onClick={handleLogout}
          className="cursor-pointer flex items-center justify-center p-2"
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 hover:text-black" />
        </button>
      </div>
    </aside>
  );
}
