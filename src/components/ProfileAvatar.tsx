"use client";

import { useRef, useState } from "react";
import { User, Pencil, X, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import CropModal from "@/components/CropModal";

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
  const [cropOpen, setCropOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

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

  const handleEdit = () => {
    if (src) setCropOpen(true);
  };

  const handleCropComplete = async (croppedFile: File) => {
    setIsUploading(true);
    try {
      await onChange(croppedFile);
    } finally {
      setIsUploading(false);
      setCropOpen(false);
    }
  };

  return (
    <div className="relative w-32 h-32 mx-auto mb-4">
      <div className="w-32 h-32 rounded-full overflow-hidden relative">
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
            <User className="w-16 h-16" />
          </div>
        )}
      </div>

      {/* Edit / Upload Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2"
          >
            <Pencil className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleEdit}>Edit Photo</DropdownMenuItem>
          <DropdownMenuItem onClick={handleFileInputClick}>
            Upload New
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      {/* Delete Button */}
      {src && !isUploading && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Crop Modal */}
      {src && (
        <CropModal
          open={cropOpen}
          imageSrc={src}
          onClose={() => setCropOpen(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
