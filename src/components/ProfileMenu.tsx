import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { IUser } from "@/types/User";

interface ProfileMenuProps {
  user: IUser;
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-6 w-6">
          <AvatarImage src={user.profileImage || ""} alt={user.name} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Manage Users</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
