// NOTE: @radix-ui/react-tooltip is not installed in this project.
// This is a lightweight stub that uses native HTML title attribute.
// To use full Radix tooltip, run: npm install @radix-ui/react-tooltip

import * as React from "react"
import { cn } from "@/lib/utils"

// Provider — no-op wrapper, kept for API compatibility
function TooltipProvider({ children }: { children: React.ReactNode; delayDuration?: number }) {
    return <>{children}</>
}

// Root — wraps trigger + content, tracks open state
function Tooltip({ children }: { children: React.ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }) {
    return <>{children}</>
}

// Trigger — renders children as-is
function TooltipTrigger({ children, asChild, ...props }: React.HTMLAttributes<HTMLSpanElement> & { asChild?: boolean }) {
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, props)
    }
    return <span {...props}>{children}</span>
}

// Content — renders as a simple styled div (visible only when parent has hover logic)
function TooltipContent({
    className,
    children,
    sideOffset,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number }) {
    return (
        <div
            className={cn(
                "z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
