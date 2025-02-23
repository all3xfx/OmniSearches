import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ThinkingComponent } from '@/components/ThinkingComponent';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchResultsSkeletonProps {
  searchMode: 'concise' | 'default' | 'exhaustive' | 'search' | 'reasoning';
  thinkingContent?: string;
}

export function SearchResultsSkeleton({ searchMode, thinkingContent }: SearchResultsSkeletonProps) {
  const shimmerAnimation = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const { t } = useTranslation();

  return (
    <motion.div 
      className="space-y-6 animate-in fade-in-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Thinking Component */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {searchMode === 'reasoning' && (
          <ThinkingComponent 
            streamingContent={thinkingContent || ''}
            isComplete={true}
            isToggled={false}
          />
        )}
      </motion.div>
      {/* Sources Heading */}
      <div className="flex items-center gap-2 my-4">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <h2 className="md:text-xl text-lg font-semibold text-foreground/90 dark:text-white/90">{t('loading.searching')}</h2>
      </div>
      {/* Additional results */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            {...shimmerAnimation}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6">
              <Skeleton className="h-5 w-2/3 mb-4" />
              <Skeleton className="h-4 w-[95%] mb-2" />
              <Skeleton className="h-4 w-[85%]" />
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}