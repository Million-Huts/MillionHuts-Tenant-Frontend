import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative h-10 w-20 rounded-full p-1 transition-colors duration-500 ease-in-out
                ${isDark ? "bg-slate-900 border border-border/40 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.3)]" : "bg-primary/10 border border-primary/20"}
            `}
            aria-label="Toggle theme"
        >
            {/* The Sliding Knob */}
            <motion.div
                className={`
                    relative flex h-8 w-8 items-center justify-center rounded-full shadow-lg
                    ${isDark ? "bg-accent" : "bg-white"}
                `}
                animate={{ x: isDark ? 40 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.div
                            key="moon"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon className="h-4 w-4 text-white fill-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun className="h-4 w-4 text-primary fill-primary/20" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Decorative Sparkle for Dark Mode */}
                {isDark && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2, times: [0, 0.5, 1] }}
                        className="absolute -top-1 -right-1"
                    >
                        <Sparkles className="h-3 w-3 text-accent-foreground opacity-50" />
                    </motion.div>
                )}
            </motion.div>

            {/* Hidden Track Icons (Purely Visual) */}
            <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                <Sun className={`h-4 w-4 transition-opacity duration-300 ${isDark ? "opacity-30" : "opacity-0"}`} />
                <Moon className={`h-4 w-4 transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-30"}`} />
            </div>
        </button>
    );
};