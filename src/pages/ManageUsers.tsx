import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/features/useAdmin";
import { useGetMeQuery } from "@/features/useAuth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { toast } from "sonner";

const ManageUsers = () => {
  const { data: user } = useGetMeQuery();
  const { data: users = [], isLoading } = useGetAllUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleRoleChange = async (id: string, newRole: "user" | "admin") => {
    try {
      const res = await updateUserRole({ id, role: newRole }).unwrap();
      toast.success(res.message);
    } catch {
      toast.error("Failed to update user role.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteUser(id).unwrap();
      toast.success(res.message);
    } catch {
      toast.error("Failed to delete user.");
    }
  };

  if (!user) return null;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Users</h1>
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="border px-4 py-2 text-center">{u.name}</td>
                <td className="border px-4 py-2 text-center">{u.email}</td>
                <td className="border px-4 py-2 text-center">
                  <Select
                    value={u.role}
                    onValueChange={(value) =>
                      handleRoleChange(u._id, value as "user" | "admin")
                    }
                  >
                    <SelectTrigger className="w-[120px] mx-auto">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="border px-4 py-2 text-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this user.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(u._id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Confirm Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
