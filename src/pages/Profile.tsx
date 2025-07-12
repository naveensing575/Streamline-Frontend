// src/pages/Profile.tsx

import { useState } from "react";
import { useGetMeQuery } from "@/features/authApi";
import { useUpdateProfileMutation } from "@/features/use";
import { toast } from "sonner";

export default function Profile() {
  const { data: user } = useGetMeQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    try {
      await updateProfile(formData).unwrap();
      toast.success("✅ Profile updated!");
    } catch {
      toast.error("❌ Failed to update profile.");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <img
        src={user.profileImage}
        alt="Profile"
        className="w-24 h-24 rounded-full mb-4 object-cover"
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="password"
          value={password}
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
