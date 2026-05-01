// NOTE: @radix-ui/react-scroll-area is not installed in this project.
// This is a lightweight stub using a native scrollable div.
// To use full Radix ScrollArea, run: npm install @radix-ui/react-scroll-area

import * as React from "react"
import { cn } from "@/lib/utils"

function ScrollArea({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-slot="scroll-area"
            className={cn("relative overflow-auto", className)}
            {...props}
        >
            {children}
        </div>
    )
}

function ScrollBar({
    className,
    orientation = "vertical",
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { orientation?: "vertical" | "horizontal" }) {
    return null // Native scrollbar used instead
}

export { ScrollArea, ScrollBar }
