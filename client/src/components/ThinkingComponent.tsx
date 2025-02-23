import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ThinkingComponentProps {
  streamingContent: string;
  isComplete: boolean;
  isToggled?: boolean;
}

export const ThinkingComponent: React.FC<ThinkingComponentProps> = ({ 
  streamingContent, 
  isComplete,
  isToggled = true // Default value set to true
}) => {
  const [isVisible, setIsVisible] = useState(isToggled);

  const {t} = useTranslation();

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex justify-between mt-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground"/>
          <h2 className="md:text-xl text-lg font-semibold text-foreground/90 dark:text-white/90">
            {isComplete ? t('loading.thinkingComplete') : t('loading.thinking')}
          </h2>
        </div>
        <button 
            onClick={handleToggle}
            className="
              inline-flex items-center gap-1 px-3 py-1.5 
              text-xs sm:text-sm font-medium
              text-gray-600 dark:text-gray-300 
              hover:text-gray-900 dark:hover:text-white
              bg-white dark:bg-gray-800
              hover:bg-gray-50 dark:hover:bg-gray-700
              border border-gray-200 dark:border-gray-700 
              rounded-full
              transition-all duration-200
              focus:outline-none focus:ring-2 
              focus:ring-blue-500/40 dark:focus:ring-blue-500/50
            "
          >
            {isVisible ? t('buttons.hide') : t('buttons.show')}
          </button>
      </div>
      {/* Content */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-800 p-6 rounded-xl"
        >
          {streamingContent.split('\n').map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.01 }}
            >
              <ReactMarkdown className="mb-2">
                {line}
              </ReactMarkdown>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};