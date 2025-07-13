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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function ManageUsers() {
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

  if (user.role !== "admin") {
    return (
      <div className="mt-12 p-6 bg-white rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600">
          Sorry, you do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left">Name</th>
                <th className="border px-4 py-3 text-left">Email</th>
                <th className="border px-4 py-3 text-left">Role</th>
                <th className="border px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr
                  key={u._id}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50 hover:bg-gray-100"
                  }
                >
                  <td className="border px-4 py-3">{u.name}</td>
                  <td className="border px-4 py-3">{u.email}</td>
                  <td className="border px-4 py-3">
                    <Select
                      value={u.role}
                      onValueChange={(value) =>
                        handleRoleChange(u._id, value as "user" | "admin")
                      }
                    >
                      <SelectTrigger className="w-[120px] mx-auto cursor-pointer">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border px-4 py-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                        >
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
        </div>
      )}
    </div>
  );
}
