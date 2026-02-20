import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
    variant?: "fullscreen" | "block";
    className?: string;
}

export const LoadingOverlay = ({
    isLoading,
    message,
    variant = "block",
    className,
}: LoadingOverlayProps) => {
    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        "z-[100] flex flex-col items-center justify-center gap-4",
                        "bg-background/70 backdrop-blur-md", // Enhanced glass effect
                        variant === "fullscreen" ? "fixed inset-0" : "absolute inset-0 rounded-[inherit]",
                        className
                    )}
                >
                    <div className="relative flex items-center justify-center">
                        {/* Soft Outer Pulse */}
                        <motion.div
                            animate={{
                                scale: [1, 1.4, 1],
                                opacity: [0.2, 0, 0.2]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut"
                            }}
                            className="absolute h-10 w-10 rounded-full bg-primary"
                        />

                        {/* Spinner */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                repeat: Infinity,
                                duration: 0.8,
                                ease: "linear"
                            }}
                            className="text-primary relative z-10"
                        >
                            <Loader2 size={variant === "fullscreen" ? 32 : 24} />
                        </motion.div>
                    </div>

                    {message && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-sm font-semibold tracking-tight text-foreground/80"
                        >
                            {message}
                        </motion.p>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};