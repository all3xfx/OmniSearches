import { useCallback } from 'react';
import { useImageStore } from '@/store/imageStore';

interface UploadedImage {
  id: string;
  data: string;
  mimeType: string;
}

export function useImageUpload() {
  const { setUploadedImages } = useImageStore();

  const handleImageUpload = useCallback((files: File[]) => {
    Promise.all(
      files.map((file) => 
        new Promise<UploadedImage>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: crypto.randomUUID(), // Add unique ID
              data: (reader.result as string).split(',')[1],
              mimeType: file.type
            });
          };
          reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
          reader.readAsDataURL(file);
        })
      )
    ).then((images) => {
      setUploadedImages(images);
    }).catch((error) => {
      console.error('Error uploading images:', error);
    });
  }, [setUploadedImages]);

  return { handleImageUpload };
}