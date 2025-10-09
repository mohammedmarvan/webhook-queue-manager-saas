import { cn } from "@/lib/utils" // shadcn/ui ships a cn() helper for merging classNames

interface TypographyH4Props {
    children: React.ReactNode
    className?: string
  }
  
export function TypographyH4({ children, className }: TypographyH4Props) {
    return (
        <h4
        className={cn(
            className
        )}
        >
            {children}
        </h4>
    )
}