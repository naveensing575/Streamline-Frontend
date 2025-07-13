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
    <aside className="w-16 sm:w-20 bg-white border-r flex flex-col justify-between items-center py-4">
      {/* Logo */}
      <div className="mb-4">
        <Link to="/" className="flex items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* Center Nav Icons */}
      <nav className="flex flex-col items-center gap-6 flex-1 justify-center">
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
                } h-5 w-5 sm:h-6 sm:w-6`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Bottom Settings & Logout */}
      <div className="flex flex-col items-center gap-6 mt-4 pb-2">
        <Link
          to="/settings"
          className={`flex items-center justify-center p-2 rounded-lg ${
            location.pathname === "/settings"
              ? "bg-black text-white"
              : "text-gray-700"
          } hover:text-black`}
        >
          <Settings
            className={`${
              location.pathname === "/settings" ? "text-white" : "text-gray-700"
            } h-5 w-5 sm:h-6 sm:w-6`}
          />
        </Link>

        <button
          onClick={handleLogout}
          className="cursor-pointer flex items-center justify-center p-2"
        >
          <LogOut  className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 hover:text-black" />
        </button>
      </div>
    </aside>
  );
}
