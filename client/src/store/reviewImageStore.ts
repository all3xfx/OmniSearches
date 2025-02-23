import { create } from 'zustand';

interface ReviewImage {
  id: string;
  data: string;
  mimeType: string;
}

interface ReviewImageStore {
  reviewImages: ReviewImage[];
  setReviewImages: (images: ReviewImage[]) => void;
  clearReviewImages: () => void;
}

export const useReviewImageStore = create<ReviewImageStore>((set) => ({
  reviewImages: [],
  setReviewImages: (images) => set({ reviewImages: images }),
  clearReviewImages: () => set({ reviewImages: [] }),
}));