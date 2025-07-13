import { useState } from "react";
import { User, Plus, X, Loader2 } from "lucide-react";

export default function ProfileAvatar({
  src,
  onChange,
  onDelete,
}: {
  src?: string;
  onChange: (file: File | null) => Promise<void> | void;
  onDelete: () => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    setIsUploading(true);
    try {
      await onChange(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    onDelete();
    onChange(null);
  };

  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <div className="w-24 h-24 rounded-full overflow-hidden relative">
        {isUploading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : src ? (
          <img
            src={src}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <User className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Upload Button */}
      <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
        />
        <Plus className="h-4 w-4" />
      </label>

      {/* Delete Button */}
      {src && !isUploading && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
