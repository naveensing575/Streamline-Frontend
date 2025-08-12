import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from '@/features/useAdmin'
import { useGetMeQuery } from '@/features/useAuth'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import ConfirmDialog from '@/components/ConfirmDialog'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function ManageUsers() {
  const { data: user } = useGetMeQuery()
  const { data: users = [], isLoading } = useGetAllUsersQuery()
  const [updateUserRole] = useUpdateUserRoleMutation()
  const [deleteUser] = useDeleteUserMutation()

  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

  const handleRoleChange = async (id: string, newRole: 'user' | 'admin') => {
    try {
      const res = await updateUserRole({ id, role: newRole }).unwrap()
      toast.success(res.message)
    } catch {
      toast.error('Failed to update user role.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteUser(id).unwrap()
      toast.success(res.message)
    } catch {
      toast.error('Failed to delete user.')
    } finally {
      setOpenDialogId(null)
    }
  }

  if (!user) return null

  if (user.role !== 'admin') {
    return (
      <div className="mt-12 p-6 bg-white rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600">
          Sorry, you do not have permission to view this page.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
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
                      ? 'bg-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }
                >
                  <td className="border px-4 py-3">{u.name}</td>
                  <td className="border px-4 py-3">{u.email}</td>
                  <td className="border px-4 py-3">
                    <Select
                      value={u.role}
                      onValueChange={(value) =>
                        handleRoleChange(u._id, value as 'user' | 'admin')
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
                    <Button
                      variant="destructive"
                      size="sm"
                      className="hover: cursor-pointer"
                      onClick={() => setOpenDialogId(u._id)}
                    >
                      Delete
                    </Button>

                    <ConfirmDialog
                      open={openDialogId === u._id}
                      onOpenChange={(open) =>
                        setOpenDialogId(open ? u._id : null)
                      }
                      title="Delete this user?"
                      description="This will permanently delete this user. This action cannot be undone."
                      confirmText="Yes, Delete"
                      onConfirm={() => handleDelete(u._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
