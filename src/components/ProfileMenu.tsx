import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UserDropdownMenu from "@/components/UserDropdownMenu";
import type { IUser } from "@/types/User";

interface ProfileMenuProps {
  user: IUser;
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const items = [
    { label: "Profile", href: "/profile" },
    { label: "Settings" },
    { label: "Manage Users" },
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
