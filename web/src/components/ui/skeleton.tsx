import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-none bg-neutral-200 dark:bg-gray-950", className)}
      {...props}
    />
  )
}

export { Skeleton }
