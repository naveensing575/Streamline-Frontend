import type { IUser } from "@/types/User";
import { Bell } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

interface NavbarProps {
  user: IUser;
  logout: () => void;
}

export default function Navbar({ user, logout }: NavbarProps) {
  return (
    <nav className="flex justify-between items-center px-4 py-4 border-b">

      <div className="flex items-center gap-8 cursor-pointer">
        <button className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>

        <ProfileMenu user={user} logout={logout} />
      </div>
    </nav>
  );
}
