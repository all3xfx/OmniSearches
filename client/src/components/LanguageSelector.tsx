// client/src/components/LanguageSelector.tsx
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronUp, ChevronDown, Globe } from 'lucide-react';

export function LanguageSelector() {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
                    hover:bg-gray-100 dark:hover:bg-gray-800 
                    transition-all duration-200 min-w-[160px]
                    bg-transparent
                    border border-gray-200 dark:border-gray-700
                    focus:outline-none focus:ring-2 focus:ring-gray-200 
                    dark:focus:ring-gray-700"
      >
        <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <div className="flex flex-1">
          <span className="text-sm">
            {languages.find((lang) => lang.code === currentLanguage)?.label || t('Select Language')}
          </span>
        </div>
        {isOpen ? 
          <ChevronUp className="w-3 h-3 text-gray-500 dark:text-gray-400" /> : 
          <ChevronDown className="w-3 h-3 text-gray-500 dark:text-gray-400" />
        }
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute left-0 w-full bg-white dark:bg-gray-800 
                     rounded-lg shadow-lg overflow-hidden border border-gray-200 
                     dark:border-gray-700 
                     z-10 top-full mt-1"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 w-full text-left
                  transition-colors duration-200
                  ${lang.code === currentLanguage
                  ? 'bg-gray-50 dark:bg-gray-700/70 text-gray-900 dark:text-white'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                }`}
            >
              <div className="flex flex-col">
                <span className="text-base py-1 px-2">{lang.label}</span>
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}