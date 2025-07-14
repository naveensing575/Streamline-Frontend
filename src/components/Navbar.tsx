import { Bell } from "lucide-react";
import type { IUser } from "@/types/User";
import ProfileMenu from "./ProfileMenu";
import UserDropdownMenu from "./UserDropdownMenu";

interface NavbarProps {
  user: IUser;
}

export default function Navbar({ user }: NavbarProps) {
  const notifications = [
    { label: "New comment on task" },
    { label: "Task due today" },
    { label: "Team member joined" },
  ];

  return (
    <nav className="flex justify-between items-center px-4 py-4 border-b">
      <div className="flex items-center gap-8">
        <UserDropdownMenu
          trigger={
            <button className="relative">
              <Bell className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {notifications.length}
              </span>
            </button>
          }
          items={notifications}
          align="start"
        />

        <ProfileMenu user={user} />
      </div>
    </nav>
  );
}
