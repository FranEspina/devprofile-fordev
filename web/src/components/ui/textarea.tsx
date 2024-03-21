import * as React from "react"

import { cn } from "@/lib/utils"
import { useProfileStore } from "@/store/profileStore";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }



const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {

    const theme = useProfileStore(state => state.theme)
    const [scrollStyle, setScrollStyle] = React.useState<React.CSSProperties>()

    React.useEffect(() => {
      if (theme === 'dark') {
        setScrollStyle({
          scrollbarColor: 'gray black',
        })
      }
      else {
        setScrollStyle({
          scrollbarColor: 'lightgray white',
        })
      }

    }, [theme])

    return (
      <textarea style={scrollStyle}
        className={cn(
          "flex min-h-[80px] w-full rounded-none border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-slate-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-blue-800",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
