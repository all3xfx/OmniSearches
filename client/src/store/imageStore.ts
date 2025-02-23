import { create } from 'zustand';
import { useReviewImageStore } from '@/store/reviewImageStore';

interface UploadedImage {
  id: string;
  data: string;
  mimeType: string;
}

interface ImageStore {
  uploadedImages: UploadedImage[];
  isUploading: boolean;
  setUploadedImages: (images: UploadedImage[]) => void;
  setIsUploading: (isUploading: boolean) => void;
  clearImages: () => void;
  deleteImage: (id: string) => void;
  transferImagesToReview: () => void; // Add this function
}

export const useImageStore = create<ImageStore>((set, get) => ({
  uploadedImages: [],
  isUploading: false,
  setUploadedImages: (images) => set({ uploadedImages: images }),
  setIsUploading: (isUploading) => set({ isUploading }),
  clearImages: () => set({ uploadedImages: [] }),
  deleteImage: (id) =>
    set((state) => ({
      uploadedImages: state.uploadedImages.filter((image) => image.id !== id),
    })),
  transferImagesToReview: () => {
    const { uploadedImages } = get();
    const { setReviewImages } = useReviewImageStore.getState();
    setReviewImages(uploadedImages);
    set({ uploadedImages: [] });
  },
}));