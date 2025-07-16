import { useRef, useState } from 'react'
import { User, UserPlus, Pencil, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import CropModal from '@/components/CropModal'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Loader from './Loader'

export default function ProfileAvatar({
  src,
  onChange,
  onDelete,
}: {
  src?: string
  onChange: (file: File | null) => Promise<void> | void
  onDelete: () => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [cropOpen, setCropOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (file: File | null) => {
    if (!file) return
    setIsUploading(true)
    try {
      await onChange(file)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = () => {
    onDelete()
    onChange(null)
  }

  const handleEdit = () => {
    setCropOpen(true)
  }

  const handleCropComplete = async (croppedFile: File) => {
    setIsUploading(true)
    try {
      await onChange(croppedFile)
    } finally {
      setIsUploading(false)
      setCropOpen(false)
    }
  }

  return (
    <div className="relative w-32 h-32 mx-auto mb-4">
      <div
        className="w-32 h-32 rounded-full overflow-hidden relative cursor-pointer"
        onClick={() => src && setPreviewOpen(true)}
      >
        {isUploading ? (
          <Loader/>
        ) : src ? (
          <img
            src={src}
            alt="Profile"
            className="w-full h-full object-cover"
            draggable="false"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 relative">
            <User className="w-16 h-16" />
            <UserPlus className="w-6 h-6 text-blue-500 absolute bottom-2 right-2" />
          </div>
        )}
      </div>

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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      {src && !isUploading && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {src && (
        <CropModal
          open={cropOpen}
          imageSrc={src}
          onClose={() => setCropOpen(false)}
          onCropComplete={handleCropComplete}
        />
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="flex flex-col items-center gap-4 p-6 max-w-md rounded-2xl shadow-lg bg-white">
          {src && (
            <img
              src={src}
              alt="Full Preview"
              className="max-w-full max-h-[300px] rounded-lg object-cover"
            />
          )}
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => {
                setPreviewOpen(false)
                handleEdit()
              }}
            >
              Edit
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setPreviewOpen(false)
                handleFileInputClick()
              }}
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
