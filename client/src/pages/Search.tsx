import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { SearchInput } from '@/components/SearchInput';
import { SearchResults } from '@/components/SearchResults';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import SearchControls from '@/components/SearchControls';
import {Navigation} from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import { useImageStore } from '@/store/imageStore';
import { ImagePreviews } from '@/components/ImagePreviews';
import { useReviewImageStore } from '@/store/reviewImageStore';

export function Search() {
  type SearchMode = 'concise' | 'default' | 'exhaustive' | 'search' | 'reasoning';
  const [location, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentResults, setCurrentResults] = useState<any>(null);
  const [originalQuery, setOriginalQuery] = useState<string | null>(null);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [followUpQuery, setFollowUpQuery] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingContent, setThinkingContent] = useState('');
  const [isThinkingComplete, setIsThinkingComplete] = useState(false);
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { uploadedImages, transferImagesToReview, clearImages, deleteImage } = useImageStore();

  // Extract query from URL, handling both initial load and subsequent navigation
  const getQueryFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('q') || '';
  };

  const getModeFromUrl = (): SearchMode => {
    const searchParams = new URLSearchParams(window.location.search);
    const mode = searchParams.get('mode');
    if (mode && ['concise', 'default', 'exhaustive', 'search', 'reasoning'].includes(mode)) {
      return mode as SearchMode;
    }
    return 'default';
  };
  
  const [searchQuery, setSearchQuery] = useState(getQueryFromUrl);
  const [refetchCounter, setRefetchCounter] = useState(0);
  const [searchMode, setSearchMode] = useState<SearchMode>(getModeFromUrl);

  const handleModeChange = (newMode: SearchMode) => {
    setSearchMode(newMode);
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery, refetchCounter],
    queryFn: async () => {
      if (!searchQuery) return null;

      // Transfer images when URL changes
      if (uploadedImages.length > 0){
        transferImagesToReview();
      }else{
        useReviewImageStore.getState().clearReviewImages;
      }

      let currentReasoning = '';
      if (searchMode === 'reasoning') {
        // Wait for reasoning to complete and get the result directly
        currentReasoning = await handleReasoningStream(searchQuery) || '';
      }
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          mode: searchMode,
          reasoning: currentReasoning,
          language: i18n.language,
          user_images: uploadedImages
        }),
      });

      if (!response.ok) throw new Error('Search failed');
      const result = await response.json();
      console.log('Search API Response:', JSON.stringify(result, null, 2));
      if (result.sessionId) {
        setSessionId(result.sessionId);
        setCurrentResults(result);
        if (!originalQuery) {
          setOriginalQuery(searchQuery);
        }
        setIsFollowUp(false);
      }
      return result;
    },
    enabled: !!searchQuery,
  });

  // Follow-up mutation
  const followUpMutation = useMutation({
    mutationFn: async (followUpQuery: string) => {
      if (!sessionId) {
        const response = await fetch(`/api/search?q=${encodeURIComponent(followUpQuery)}&mode=${searchMode}`);
        if (!response.ok) throw new Error('Search failed');
        const result = await response.json();
        console.log('New Search API Response:', JSON.stringify(result, null, 2));
        if (result.sessionId) {
          setSessionId(result.sessionId);
          setOriginalQuery(searchQuery);
          setIsFollowUp(false);
        }
        return result;
      }

      const response = await fetch('/api/follow-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          query: followUpQuery,
        }),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          const newResponse = await fetch(`/api/search?q=${encodeURIComponent(followUpQuery)}&mode=${searchMode}`);
          if (!newResponse.ok) throw new Error('Search failed');
          const result = await newResponse.json();
          console.log('Fallback Search API Response:', JSON.stringify(result, null, 2));
          if (result.sessionId) {
            setSessionId(result.sessionId);
            setOriginalQuery(searchQuery);
            setIsFollowUp(false);
          }
          return result;
        }
        throw new Error('Follow-up failed');
      }
      
      const result = await response.json();
      console.log('Follow-up API Response:', JSON.stringify(result, null, 2));
      return result;
    },
    onSuccess: (result) => {
      setCurrentResults(result);
      setIsFollowUp(true);
    },
  });

  const handleReasoningStream = async (query: string) => {
    setIsThinking(true);
    setThinkingContent('');
    setIsThinkingComplete(false);

    let accumulatedContent = '';
  
    try {
      const response = await fetch(`/api/reasoning?q=${encodeURIComponent(query)}&language=${i18n.language}`);
      const reader = response.body?.getReader();
      
      if (!reader) {
        throw new Error('No reader available');
      }
  
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(5));
              
              if (data.complete) {
                setIsThinking(false);
                setIsThinkingComplete(true);
              } else if (data.content) {
                accumulatedContent += data.content;
                setThinkingContent(prev => prev + data.content);
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }
      return accumulatedContent;
    } catch (error) {
      console.error('Error in reasoning stream:', error);
    }
  };

  const handleSearch = async (newQuery: string) => {
    try {
      
      if (newQuery === searchQuery) {
        setRefetchCounter(c => c + 1);
      } else {
        setSessionId(null);
        setOriginalQuery(null);
        setIsFollowUp(false);
        setSearchQuery(newQuery);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      const newUrl = `/search?q=${encodeURIComponent(newQuery)}&mode=${searchMode}`;
      window.history.pushState({}, '', newUrl);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleFollowUp = async (newFollowUpQuery: string) => {
    setFollowUpQuery(newFollowUpQuery);
    await followUpMutation.mutateAsync(newFollowUpQuery);
  };

  // Automatically start search and reasoning when component mounts or URL changes
  useEffect(() => {
    const query = getQueryFromUrl();
    const mode = getModeFromUrl();

    if (query && query !== searchQuery) {
      setSessionId(null);
      setOriginalQuery(null);
      setIsFollowUp(false);
      setSearchQuery(query);

      if (mode === 'reasoning') {
        handleReasoningStream(query);
      }
    }
    setSearchMode(mode);

    // Only clear images when leaving the search page
    return () => {
      if (window.location.pathname !== '/search') {
        clearImages();
        useReviewImageStore.getState().clearReviewImages();
      }
    };
  }, [location]);

  // Use currentResults if available, otherwise fall back to data from useQuery
  const displayResults = currentResults || data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <Navigation/>

      {/* Add padding to account for fixed nav */}
      <div className="pt-20" />
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto p-2"
      >
        <div className="flex justify-between items-center gap-4">
          <a 
          className='flex items-center gap-2 text-gray-700 dark:text-white'
            aria-label='Back to home'
            href='/'
          >
            <ChevronLeft className='w-5 h-5'/>
            <span>{t('buttons.back')}</span>
          </a>
          <SearchControls
            searchMode={searchMode}
            onSearchModeChange={handleModeChange}
            direction='right'
          />
        </div>
      </motion.div>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto p-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={searchQuery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-stretch mb-24 sm:mb-28 lg:mb-32"
          >
            <SearchResults
              query={isFollowUp ? (followUpQuery || '') : searchQuery}
              results={displayResults}
              isLoading={isLoading || followUpMutation.isPending}
              error={error || followUpMutation.error || undefined}
              isFollowUp={isFollowUp}
              originalQuery={originalQuery || ''}
              onRelatedQuestionClick={handleSearch}
              isThinking={isThinking}
              thinkingContent={thinkingContent}
              isThinkingComplete={isThinkingComplete}
              searchMode={searchMode}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Search Input */}
      {displayResults && !isLoading && (
        <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center z-40">
          <div className="w-[90vw] lg:w-[80vw] xl:w-[60vw]">
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
            <SearchInput
              onSearch={handleSearch}
              initialValue={''}
              isLoading={isLoading}
              autoFocus={false}
              large={false}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}