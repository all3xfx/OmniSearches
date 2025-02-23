import { motion } from 'framer-motion';
import { useState } from 'react';
import { Images, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Image {
  url: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: Image[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const { t } = useTranslation();

  if (!images || images.length === 0) return null;

  const initialImages = showAll ? images : images.slice(0, 4);
  const hasMoreImages = images.length > 4;
  const remainingImages = images.length - 4;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Images className="h-4 w-4 text-muted-foreground" />
          <h2 className="md:text-xl text-lg font-semibold text-foreground/90 dark:text-white/90">{t('images.title')}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {initialImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={image.url}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover transform transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
            </div>
            {image.caption && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-1 dark:text-gray-400">
                {image.caption}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {hasMoreImages && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAll(!showAll)}
          className="mt-4 flex items-center justify-center gap-2 text-sm 
                    text-gray-600 hover:text-gray-800  dark:text-gray-400 dark:hover:text-gray-300
                    mx-auto py-2 px-4 rounded-full 
                    border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600
                    transition-colors duration-200"
          aria-expanded={showAll}
          aria-controls="image-gallery"
          title={showAll ? t('images.showLess') : t(remainingImages === 1 ? 'images.showMoreSingular' : 'images.showMore', { count: remainingImages })}
        >
          {showAll ? (
            <>
              <ChevronUp />
              <span>{t('images.showLess')}</span>
            </>
          ) : (
            <>
              <ChevronDown/>
              <span>{t(remainingImages === 1 ? 'images.showMoreSingular' : 'images.showMore', { count: remainingImages })}</span>
            </>
          )}
        </motion.button>
      )}

      {/* Modal enhancements */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="relative w-full max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
              aria-label="Close image preview"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            {selectedImage.caption && (
              <p 
                id="modal-title"
                className="mt-4 text-white text-center"
              >
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}