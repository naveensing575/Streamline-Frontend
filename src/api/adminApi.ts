import axios from './axios'
import type { IUser } from '@/types/User'

export const getAllUsers = async (token: string): Promise<IUser[]> => {
  const res = await axios.get('/admin/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}

export const updateUserRole = async (id: string, role: string, token: string) => {
  const res = await axios.patch(`/admin/users/${id}/role`, { role }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}

export const deleteUser = async (id: string, token: string) => {
  const res = await axios.delete(`/admin/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}
