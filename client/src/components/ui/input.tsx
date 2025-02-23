import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className="
          w-full
          pl-14 sm:pl-16 md:pl-16
          pr-16 sm:pr-24 md:pr-32
          py-3 sm:py-4 md:py-5
          text-base md:text-lg
          rounded-2xl
          bg-white/90 dark:bg-gray-900/90
          border-2 border-gray-300 dark:border-gray-700
          text-gray-800 dark:text-white placeholder-gray-300
          focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent
          backdrop-blur-sm transition-all duration-300 truncate
        "
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
