import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  MessageSquareMore, 
  Search,
  Telescope,
  Sparkle,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import {useTranslation} from 'react-i18next';

interface SearchControlsProps {
  searchMode?: 'concise' | 'default' | 'exhaustive' | 'search' | 'reasoning'
  onSearchModeChange: (mode: 'concise' | 'default' | 'exhaustive' | 'search' | 'reasoning') => void
  direction?: 'left' | 'right'
}

export default function SearchControls({ 
  searchMode = 'default',
  onSearchModeChange,
  direction = 'right'  // Add default value
}: SearchControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation();

  const modes = [
    { 
      value: 'concise',
      label: t('search.modes.concise.label'),
      icon: MessageSquare,
      description: t('search.modes.concise.description')
    },
    { 
      value: 'default',
      label: t('search.modes.default.label'),
      icon: MessageSquareMore,
      description: t('search.modes.default.description')
    },
    { 
      value: 'exhaustive',
      label: t('search.modes.exhaustive.label'),
      icon: Telescope,
      description: t('search.modes.exhaustive.description')
    },
    { 
      value: 'search',
      label: t('search.modes.search.label'),
      icon: Search,
      description: t('search.modes.search.description')
    },
    { 
      value: 'reasoning',
      label: t('search.modes.reasoning.label'),
      icon: Sparkle,
      description: t('search.modes.reasoning.description')
    }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentMode = modes.find(mode => mode.value === searchMode)
  const Icon = currentMode?.icon || MessageSquareMore

  // Update the dropdown position classes
  const positionClasses = direction === 'left' 
    ? 'left-0' 
    : 'right-0'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4"
    >
      {/* Mode Selector Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg
                    hover:bg-gray-200/50 dark:hover:bg-gray-700/50 
                    transition-all duration-300
                    "
        > 
          <Icon className="w-4 h-4" />
          <div className="flex flex-1">
            <span className="text-sm font-medium">{currentMode?.label}</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute w-full bg-white dark:bg-gray-800 
                     rounded-xl shadow-lg overflow-hidden border border-gray-200 
                     dark:border-gray-700 min-w-[200px]
                     z-10 top-full mt-2 
                     ${positionClasses}`}
          >
            {modes.map(({ value, label, icon: ModeIcon, description }) => (
              <button
                key={value}
                onClick={() => {
                  onSearchModeChange(value as typeof searchMode)
                  setIsOpen(false)
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 w-full
                  transition-colors duration-300
                  ${value === searchMode 
                    ? 'bg-gray-100 dark:bg-gray-700' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                `}
              >
                <ModeIcon className="w-4 h-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs opacity-75">{description}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}