import { useEffect, useRef } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { SourceList } from '@/components/SourceList';
import RelatedQuestions from './RelatedQuestions';
import ImageGallery from './ImageGallery';
import {SearchResultsSkeleton} from './SearchResultsSkeleton';
import { ThinkingComponent } from '@/components/ThinkingComponent';
import { useTranslation } from 'react-i18next';
import { ImageReviews } from '@/components/ImageReviews';
import { useReviewImageStore } from '@/store/reviewImageStore';

interface SearchResultsProps {
  query: string;
  results: {
    summary: string;
    sources?: any[];
    relatedQuestions?: string[];
    images?: Array<{
      url: string;
      source: string;
      caption: string;
      alt: string;
    }>;
  };
  isLoading: boolean;
  error?: Error;
  isFollowUp?: boolean;
  originalQuery?: string;
  onRelatedQuestionClick?: (question: string) => void;
  isThinking: boolean;
  thinkingContent: string;
  isThinkingComplete: boolean;
  searchMode: 'concise' | 'default' | 'exhaustive' | 'search' | 'reasoning';
}

export function SearchResults({ 
  query,
  results,
  isLoading,
  error,
  isFollowUp,
  originalQuery,
  onRelatedQuestionClick,
  isThinking,
  thinkingContent,
  isThinkingComplete,
  searchMode
}: SearchResultsProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const {t} = useTranslation();
  const { reviewImages } = useReviewImageStore();

  /*
  useEffect(() => {
    if (results && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results]);*/

  if (error) {
    return (
      <Alert variant="destructive" className="animate-in fade-in-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message || 'An error occurred while searching. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isThinking) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 mb-10"
      >
        <div className="flex flex-row sm:items-baseline gap-3 text-sm sm:text-base text-muted-foreground justify-center">
          <h1 className="font-serif text-lg sm:text-3xl text-foreground">
            "{query}"
          </h1>
        </div>
        {/* Add ImagePreviews component after the controls */}
        {reviewImages.length > 0 && (
          <div className="mt-4">
            <ImageReviews
            />
          </div>
        )}
        <ThinkingComponent
          streamingContent={thinkingContent}
          isComplete={isThinkingComplete}
        />
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 mb-10"
      >
        <div className="flex flex-row sm:items-baseline gap-3 text-sm sm:text-base text-muted-foreground justify-center">
          <h1 className="font-serif text-lg sm:text-3xl text-foreground">
            "{query}"
          </h1>
        </div>
        {/* Add ImagePreviews component after the controls */}
        {reviewImages.length > 0 && (
          <div className="mt-4 w-full">
            <ImageReviews
            />
          </div>
        )}
        <SearchResultsSkeleton 
          searchMode={searchMode}
          thinkingContent={thinkingContent}
        />
      </motion.div>
    );
  }

  if (!results) return null;

  return (
    <div ref={contentRef} className="space-y-6 animate-in fade-in-50">
      {/* Search Query Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2 mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-sm sm:text-base text-muted-foreground justify-center">
          <h1 className="font-serif text-lg sm:text-3xl text-foreground">"{query}"</h1>
        </div>
        {/* Add ImagePreviews component after the controls */}
        {reviewImages.length > 0 && (
          <div className="mt-4">
            <ImageReviews
            />
          </div>
        )}
        {/* Add ThinkingComponent here */}
        {searchMode === 'reasoning' && (
          <ThinkingComponent
            streamingContent={thinkingContent}
            isComplete={isThinkingComplete}
            isToggled={false}
          />
        )}
      </motion.div>

      {/* Sources Section */}
      {results.sources && results.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SourceList sources={results.sources} />
        </motion.div>
      )}

      {/* Image Gallery */}
      {results.images && results.images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ImageGallery images={results.images} />
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="py-4 border-b border-gray-300 dark:border-gray-600"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <h2 className="md:text-xl text-lg font-semibold text-foreground/90 dark:text-white/90">{t('interpretations.title')}</h2>
        </div>
        <div className="px-6 overflow-x-auto">
          <div
            className={cn(
          "prose prose-slate max-w-none",
          "dark:prose-invert",
          "prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-relaxed",
          "prose-headings:font-medium prose-headings:mb-3",
          "prose-h2:text-xl prose-h2:mt-6",
          "prose-h3:text-lg prose-h3:mt-4",
          "prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6",
          "prose-li:my-2 prose-li:marker:text-gray-400",
          "prose-strong:font-medium",
          "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:opacity-80",
          "prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-gray-900 dark:prose-code:text-gray-100",
          "prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:rounded-lg prose-pre:p-4"
            )}
            dangerouslySetInnerHTML={{ 
          __html: results.summary
            }}
          />
        </div>
      </motion.div>
      {/* Related Questions */}
      {results.relatedQuestions && results.relatedQuestions.length > 0 && (
          <RelatedQuestions 
            questions={results.relatedQuestions}
            onQuestionClick={onRelatedQuestionClick || ((question: string) => {})}
          />
      )}
    </div>
  );
}