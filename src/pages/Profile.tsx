import { useState, useEffect } from "react";
import { useGetMeQuery, useUpdateProfileMutation } from "@/features/useAuth";
import { toast } from "sonner";
import ProfileAvatar from "@/components/ProfileAvatar";

export default function Profile() {
  const { data: user } = useGetMeQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      // If no new avatar, show user’s existing image
      setPreviewUrl(user.profileImage);
    }
  }, [user]);

  // Keep preview in sync when avatar changes
  useEffect(() => {
    if (avatar) {
      const url = URL.createObjectURL(avatar);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (user?.profileImage) {
      setPreviewUrl(user.profileImage);
    } else {
      setPreviewUrl(undefined);
    }
  }, [avatar, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      await updateProfile(formData).unwrap();
      toast.success("✅ Profile updated!");
      setAvatar(null); // Clear the local file state
    } catch {
      toast.error("❌ Failed to update profile.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <ProfileAvatar
        src={previewUrl}
        onChange={(file) => setAvatar(file)}
        onDelete={() => {
          setAvatar(null);
          setPreviewUrl(undefined);
        }}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
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
