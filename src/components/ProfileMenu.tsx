import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UserDropdownMenu from "@/components/UserDropdownMenu";
import type { IUser } from "@/types/User";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProfileMenuProps {
  user: IUser;
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const items = [
    { label: "Profile", href: "/profile" },
    { label: "Settings" },
    { label: "Manage Users" },
    { label: "Logout", onClick: handleLogout },
  ];

  return (
    <UserDropdownMenu
      trigger={
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={user.profileImage || ""} alt={user.name} />
        </Avatar>
      }
      items={items}
    />
  );
}
