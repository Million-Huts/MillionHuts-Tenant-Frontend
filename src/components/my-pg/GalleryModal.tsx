import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
    images: { url: string }[];
    open: boolean;
    onClose: () => void;
}

export default function GalleryModal({ images, open, onClose }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/40">
                    <span className="text-sm font-bold tracking-widest uppercase">
                        Gallery ({activeIndex + 1} / {images.length})
                    </span>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Main View Area */}
                    <div className="flex-1 relative flex items-center justify-center p-4 bg-black/5">
                        <motion.img
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={images[activeIndex].url}
                            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                        />

                        {/* Navigation Arrows (Desktop) */}
                        <div className="absolute inset-0 hidden lg:flex items-center justify-between px-4 pointer-events-none">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="pointer-events-auto rounded-full shadow-lg"
                                onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="pointer-events-auto rounded-full shadow-lg"
                                onClick={() => setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    {/* Desktop Previews / Mobile Strip */}
                    <div className="lg:w-80 border-l border-border/40 p-4 overflow-y-auto bg-muted/10">
                        <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${activeIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <img src={img.url} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}