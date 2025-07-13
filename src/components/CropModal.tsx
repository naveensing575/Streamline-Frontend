// components/CropModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import getCroppedImg from "@/lib/cropImageUtils"
import { Button } from "@/components/ui/button";

interface CropModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export default function CropModal({
  open,
  imageSrc,
  onClose,
  onCropComplete,
}: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], "cropped.jpg", {
      type: "image/jpeg",
    });
    onCropComplete(croppedFile);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md">
        <DialogHeader>Adjust your photo</DialogHeader>
        <div className="relative w-full h-64 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleDone}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
