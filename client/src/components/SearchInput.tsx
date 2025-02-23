import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {useTranslation} from 'react-i18next';
import { FileUploader } from '@/components/FileUploader';
import { useImageStore } from '@/store/imageStore';
import { useImageUpload } from '@/hooks/useImageUpload';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  autoFocus?: boolean;
  large?: boolean;
}

export function SearchInput({ 
  onSearch, 
  isLoading = false,
  initialValue = '',
  autoFocus = false,
  large = false,
}: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const { t } = useTranslation();
  const { uploadedImages, deleteImage} = useImageStore();
  const { handleImageUpload } = useImageUpload();

  return (
    <div className="relative group">
      <div className="absolute left-3 md:left-4 lg:left-5 top-1/2 -translate-y-1/2 z-10">
        <FileUploader onUpload={handleImageUpload} />
      </div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('search.placeholder')}
        disabled={isLoading}
        autoFocus={autoFocus}
      />
      <button 
        onClick={handleSubmit}
        disabled={!query.trim() || isLoading}
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
        {isLoading ? (
          <Loader2 className={cn("animate-spin", large ? "h-5 w-5" : "h-4 w-4")} />
        ) : (
          <ArrowRight className="w-5 h-5 text-lg sm:text-xl md:text-2xl" />
        )}
      </button>
    </div>
  );
}