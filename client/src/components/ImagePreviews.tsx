import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ImagePreviewsProps {
  previews: Array<{
    id: string;
    data: string;
  }>;
  onDelete: (id: string) => void;
}

export function ImagePreviews({ previews, onDelete }: ImagePreviewsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    onDelete(id);
    toast({
      title: "Image Deleted",
      description: "The image has been removed successfully",
    });
  };

  if (previews.length === 0) return null;

  return (
    <>
      <div className="flex gap-2 overflow-x-auto p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
        {previews.map(({ id, data }) => (
          <div key={id} className="relative group">
            <img
              src={`data:image/*;base64,${data}`}
              alt={`Preview ${id}`}
              className="h-20 w-20 object-cover rounded-lg cursor-pointer"
              onClick={() => {
                setSelectedImage(data);
                setSelectedId(id);
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(id);
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Delete image"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => {
            setSelectedImage(null);
            setSelectedId(null);
          }}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-2">
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setSelectedId(null);
                }}
                className="p-1 rounded-full"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <img
              src={`data:image/*;base64,${selectedImage}`}
              alt="Full size preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}