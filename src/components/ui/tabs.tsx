// NOTE: @radix-ui/react-tabs is not installed in this project.
// This is a lightweight stub using native React state.
// To use full Radix Tabs, run: npm install @radix-ui/react-tabs

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ============================================================
// CONTEXT
// ============================================================

interface TabsContextType {
    value: string
    onValueChange: (val: string) => void
    orientation: "horizontal" | "vertical"
}

const TabsContext = React.createContext<TabsContextType>({
    value: "",
    onValueChange: () => {},
    orientation: "horizontal",
})

// ============================================================
// TABS ROOT
// ============================================================

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string
    defaultValue?: string
    onValueChange?: (val: string) => void
    orientation?: "horizontal" | "vertical"
}

function Tabs({
    className,
    value: controlledValue,
    defaultValue = "",
    onValueChange,
    orientation = "horizontal",
    children,
    ...props
}: TabsProps) {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const value = controlledValue ?? internalValue

    const handleChange = (val: string) => {
        setInternalValue(val)
        onValueChange?.(val)
    }

    return (
        <TabsContext.Provider value={{ value, onValueChange: handleChange, orientation }}>
            <div
                data-slot="tabs"
                data-orientation={orientation}
                className={cn(
                    "flex gap-2",
                    orientation === "horizontal" ? "flex-col" : "flex-row",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </TabsContext.Provider>
    )
}

// ============================================================
// TABS LIST
// ============================================================

const tabsListVariants = cva(
    "inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground",
    {
        variants: {
            variant: {
                default: "bg-muted",
                line: "gap-1 bg-transparent",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

interface TabsListProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof tabsListVariants> {}

function TabsList({ className, variant = "default", ...props }: TabsListProps) {
    return (
        <div
            data-slot="tabs-list"
            data-variant={variant}
            role="tablist"
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
        />
    )
}

// ============================================================
// TABS TRIGGER
// ============================================================

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string
}

function TabsTrigger({ className, value, children, ...props }: TabsTriggerProps) {
    const { value: activeValue, onValueChange } = React.useContext(TabsContext)
    const isActive = activeValue === value

    return (
        <button
            data-slot="tabs-trigger"
            role="tab"
            aria-selected={isActive}
            data-state={isActive ? "active" : "inactive"}
            onClick={() => onValueChange(value)}
            className={cn(
                "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all",
                "text-foreground/60 hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
                "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                "dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}

// ============================================================
// TABS CONTENT
// ============================================================

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
}

function TabsContent({ className, value, children, ...props }: TabsContentProps) {
    const { value: activeValue } = React.useContext(TabsContext)

    if (activeValue !== value) return null

    return (
        <div
            data-slot="tabs-content"
            role="tabpanel"
            data-state="active"
            className={cn("flex-1 outline-none", className)}
            {...props}
        >
            {children}
        </div>
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
