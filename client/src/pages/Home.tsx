import React, { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Github } from 'lucide-react';
import SearchControls from '@/components/SearchControls';
import { Navigation } from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import { FileUploader } from '@/components/FileUploader';
import { useImageStore } from '@/store/imageStore';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImagePreviews } from '@/components/ImagePreviews';
import { useToast } from "@/hooks/use-toast"

export function Home() {
  const [query, setQuery] = useState('');
  const [, setLocation] = useLocation();
  const [searchMode, setSearchMode] = useState<'concise' | 'default' | 'exhaustive' | 'search' | 'reasoning'>('default');
  const { t } = useTranslation();
  const { uploadedImages, deleteImage} = useImageStore();
  const { handleImageUpload } = useImageUpload();
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a search query",
        variant: "destructive",
      })
      return;
    }

    const searchParams = new URLSearchParams();
    searchParams.set('q', query.trim());
    searchParams.set('mode', searchMode);
    setLocation(`/search?${searchParams.toString()}`);
  };

  const handleSearchModeChange = (mode: 'concise' | 'default' | 'exhaustive' | 'search' | 'reasoning') => {
    setSearchMode(mode);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-start pt-[20vh] bg-background overflow-y-auto">
      <Navigation />
      <div className="w-full max-w-5xl px-4 animate-fade-in">
        <div className="flex flex-col items-center mb-8 md:mb-12 lg:mb-16 xl:mb-20">
          <h1 className="text-4xl md:text-5xl text-center text-gray-700 dark:text-white">
            {t('slogan.home')}
          </h1>
        </div>
        {uploadedImages.length > 0 && (
        <div className="mb-4 w-full">
          <ImagePreviews 
            previews={uploadedImages.map(img => ({
              id: img.id,
              data: img.data
            }))} 
            onDelete={deleteImage}
          />
        </div>
        )}
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative group">
            <div className="absolute left-3 md:left-4 lg:left-5 top-1/2 -translate-y-1/2 z-10">
              <FileUploader onUpload={handleImageUpload} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder= {t('search.placeholder')}
              className="
                      w-full
                      pl-14 sm:pl-16 md:pl-16
                      pr-16 sm:pr-24 md:pr-32
                      py-3 sm:py-4 md:py-5
                      text-base sm:text-base md:text-lg
                      rounded-2xl
                      bg-white/10
                      border-2 border-gray-300 dark:border-gray-600
                      text-gray-800 dark:text-white placeholder-gray-300
                      focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent
                      backdrop-blur-sm transition-all duration-300 truncate
                      "
              autoFocus
            />
            <button 
              type="submit"
              disabled={!query.trim()}
              className="
                absolute right-2 sm:right-3 top-1/2 -translate-y-1/2
                px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 
                bg-gray-900 dark:bg-gray-700
                text-white 
                rounded-xl font-medium text-sm sm:text-base md:text-lg
                hover:bg-gray-700 dark:hover:bg-gray-800
                hover:border-gray-700 dark:hover:border-gray-800
                transition-all duration-300 flex items-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <span className="hidden lg:block">{t('buttons.search')}</span>
              <ArrowRight className="w-5 h-5 text-lg sm:text-xl md:text-2xl" />
            </button>
          </div>
          <div className='mt-4 md:mt-6'>
            <SearchControls 
              searchMode={searchMode}
              onSearchModeChange={handleSearchModeChange}
              direction='left'
            />
          </div>
        </form>
      </div>
      <div className="absolute bottom-8 flex flex-col items-center gap-3">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{t('footer.madeBy')}</span>
          <a
            href="https://www.qiyijiazhen.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font underline decoration underline-offset-4 text-primary hover:text-primary/80 dark:text-primary-foreground dark:hover:text-primary-foreground/80 transition-colors duration-200"
              >
            {t('footer.author')}
          </a>
        </div>
        <a
          href="https://github.com/kiwigaze/OmniSearches"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <Github className="w-4 h-4" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('footer.starOnGithub')}</span>
        </a>
      </div>
    </div>
  );
}
