export interface IUser {
  profileImage: string | undefined
  _id: string
  name: string
  email: string
  role?: 'user' | 'admin'
  token: string
  createdAt?: string
  updatedAt?: string
}
