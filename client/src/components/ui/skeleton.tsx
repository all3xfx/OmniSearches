import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted animate-pulse",
        "relative overflow-hidden",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r",
        "before:from-transparent",
        "before:via-white/20 dark:before:via-white/15",
        "before:to-transparent",
        "before:animate-[shimmer_2s_infinite]",
        "after:absolute after:inset-0",
        "after:bg-gradient-to-r",
        "after:from-transparent",
        "after:via-black/[0.08] dark:after:via-white/[0.08]",
        "after:to-transparent",
        "after:animate-[shimmer_2s_infinite]",
        "after:translate-x-[-100%]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
