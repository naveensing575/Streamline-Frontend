'use client'

import { useState, useEffect } from 'react'
import { useGetMeQuery, useUpdateProfileMutation } from '@/features/useAuth'
import { toast } from 'sonner'
import ProfileAvatar from '@/components/ProfileAvatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function Profile() {
  const { data: user } = useGetMeQuery()
  const [updateProfile] = useUpdateProfileMutation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [avatar, setAvatar] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPreviewUrl(user.profileImage)
    }
  }, [user])

  useEffect(() => {
    if (avatar) {
      const url = URL.createObjectURL(avatar)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else if (user?.profileImage) {
      setPreviewUrl(user.profileImage)
    } else {
      setPreviewUrl(undefined)
    }
  }, [avatar, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    if (password) formData.append('password', password)
    if (avatar) {
      formData.append('avatar', avatar)
    }

    try {
      await updateProfile(formData).unwrap()
      toast.success('✅ Profile updated!')
      setAvatar(null)
    } catch {
      toast.error('❌ Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ProfileAvatar
            src={previewUrl}
            onChange={(file) => setAvatar(file)}
            onDelete={() => {
              setAvatar(null)
              setPreviewUrl(undefined)
            }}
          />

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 mt-4"
          >
            <Input
              type="text"
              value={name}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              value={password}
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
