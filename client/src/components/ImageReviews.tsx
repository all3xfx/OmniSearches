import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useReviewImageStore } from '@/store/reviewImageStore';

export function ImageReviews() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { reviewImages } = useReviewImageStore();

  if (reviewImages.length === 0) return null;

  return (
    <>
      <div className="flex gap-2 overflow-x-auto p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
        {reviewImages.map(({ id, data }) => (
          <div key={id} className="relative group">
            <img
              src={`data:image/*;base64,${data}`}
              alt={`Preview ${id}`}
              className="h-20 w-20 object-cover rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(data)}
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-2">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-1 rounded-full"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>
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