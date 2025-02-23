// src/components/RelatedQuestions.tsx
import { 
  HelpCircle, 
  ArrowRight,
  Plus 
} from 'lucide-react';
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';

interface RelatedQuestionsProps {
  questions: string[]
  onQuestionClick: (question: string) => void
}

export default function RelatedQuestions({ questions, onQuestionClick }: RelatedQuestionsProps) {
  const { t } = useTranslation();

  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-gray-300 dark:border-gray-600">
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
        <h2 className="md:text-xl text-lg font-semibold text-foreground/90 dark:text-white/90">{t('related.title')}</h2>
      </div>

      {/* Questions List */}
      {questions.map((question, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onQuestionClick(question)}
          className="group flex items-center w-full gap-4 py-3 px-4
                    text-left text-sm
                    border-b border-gray-300 dark:border-gray-600
                    bg-transparent
                    hover:bg-gray-50
                    dark:hover:bg-gray-800
                    focus:outline-none 
                    focus:ring-2 focus:ring-gray-100
                    transition-all duration-200"
          aria-label={`Explore related question: ${question}`}
        >
          {/* Left Icon */}
          <div className="text-gray-400 dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </div>

            {/* Question Text */}
            <span className="flex-1 md:text-lg text-md text-gray-500 dark:text-gray-400 font-semibold
                    group-hover:text-gray-900 dark:group-hover:text-gray-100">
            {question}
            </span>

          {/* Right Arrow Icon */}
          <ArrowRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-300
                                  opacity-0 group-hover:opacity-100 
                                  transform translate-x-[-8px] group-hover:translate-x-0
                                  transition-all duration-200" />
        </motion.button>
      ))}
    </motion.div>
  )
}