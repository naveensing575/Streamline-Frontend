import type { IUser } from "@/types/User";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface NavbarProps {
  user: IUser;
  logout: () => void;
}

export default function Navbar({ user, logout }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("👋 Logged out successfully.");
    navigate("/login");
  };

  return (
    <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 px-4 py-4 bg-gray-100 border-b">
      <Link to="/" className="text-lg sm:text-xl font-bold">
        TaskFlowAI
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        {user?.role === "admin" && (
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link to="/admin/users">Manage Users</Link>
          </Button>
        )}

        <span className="text-sm sm:text-base text-gray-700">
          Hello, {user?.name}
        </span>

        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full sm:w-auto min-h-[40px]"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
