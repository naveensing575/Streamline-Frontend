import { User, Plus, X } from "lucide-react";

export default function ProfileAvatar({
  src,
  onChange,
  onDelete,
}: {
  src?: string;
  onChange: (file: File | null) => void;
  onDelete: () => void;
}) {
  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      {src ? (
        <img
          src={src}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
      ) : (
        <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
          <User className="w-12 h-12" />
        </div>
      )}

      <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="hidden"
        />
        <Plus className="h-4 w-4" />
      </label>

      {src && (
        <button
          type="button"
          onClick={() => {
            // Clear the src and call onDelete handler
            onDelete();
            onChange(null);
          }}
          className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
