import { ExternalLink, Globe, ChevronDown, ChevronUp  } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface SourceListProps {
  sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="space-y-4 animate-in fade-in-50">
      <div className="flex items-center justify-between mb-4">
        {/* Sources Heading */}
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <h2 className="md:text-xl text-lg font-semibold text-foreground/90 dark:text-white/90">{t('sources.title')}</h2>
        </div>

        {/* Show All Button */}
        {sources.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1 px-3 py-1.5 
                      text-xs sm:text-sm font-medium
                      text-gray-600 dark:text-gray-300 
                      hover:text-gray-900 dark:hover:text-white
                      bg-white dark:bg-gray-800
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      border border-gray-200 dark:border-gray-700 
                      rounded-full
                      transition-all duration-200
                      focus:outline-none focus:ring-2 
                      focus:ring-blue-500/40 dark:focus:ring-blue-500/50"
          >
            {showAll ? (
              <>
                {t('sources.showLess')} <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                {t('sources.showAll', { count: sources.length })} <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
      
      {/* Sources List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {(showAll ? sources : sources.slice(0, 3)).map((source, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 
                    text-xs sm:text-sm 
                    text-blue-600 dark:text-blue-400 
                    hover:text-blue-700 dark:hover:text-blue-300 
                    bg-gray-50 dark:bg-gray-800/50
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    rounded-lg
                    transition-colors duration-200 
                    border border-gray-100 dark:border-gray-700/50"
                >
                  <div className="flex items-center gap-2 line-clamp-2 hover:underline">
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${source.title}&sz=32`}
                      alt=""
                      className="w-4 h-4"
                    />
                    {source.title.replace(/\*\*/g, '')}
                    <ExternalLink className="h-3 w-3" />
                  </div>
                  {source.snippet && (
                    <p className="mt-1 text-gray-600 dark:text-gray-400 line-clamp-4 min-h-[5rem]">
                      {source.snippet.replace(/\*\*/g, '')}
                    </p>
                  )}
                </a>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${source.title}&sz=32`}
                        alt=""
                        className="w-5 h-5"
                      />
                      {source.title}
                    </h4>
                    <ReactMarkdown className="text-sm text-muted-foreground">
                      {source.snippet}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
              </HoverCardContent>
            </HoverCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}