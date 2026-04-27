import { useEffect, useRef, useState } from "react";
import { CheckCheck, BellOff, Loader2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function NotificationDropdown({ open, onClose }: Props) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle Click Outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onClose]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await apiPrivate.get("/notifications");
            setNotifications(res.data?.data || []);
        } catch {
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await apiPrivate.patch(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch { }
    };

    const markAllRead = async () => {
        try {
            await apiPrivate.patch(`/notifications/read-all`);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch { }
    };

    useEffect(() => {
        if (open) fetchNotifications();
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-card border border-border/50 rounded-2xl shadow-2xl shadow-black/20 z-[100] overflow-hidden"
                >
                    <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
                        <div>
                            <h4 className="text-sm font-bold">Notifications</h4>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Stay Updated</p>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={markAllRead}
                            className="h-8 text-xs hover:bg-primary/10 hover:text-primary"
                        >
                            <CheckCheck size={14} className="mr-2" /> Mark all read
                        </Button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-12 space-y-3">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                <p className="text-xs text-muted-foreground">Fetching updates...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                    <BellOff className="h-6 w-6 text-muted-foreground/50" />
                                </div>
                                <p className="text-sm font-medium">All caught up!</p>
                                <p className="text-xs text-muted-foreground">No new notifications found.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/40">
                                {notifications.map(n => (
                                    <div
                                        key={n.id}
                                        onClick={() => markAsRead(n.id)}
                                        className={cn(
                                            "p-4 transition-colors cursor-pointer group relative",
                                            !n.isRead ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"
                                        )}
                                    >
                                        {!n.isRead && (
                                            <Circle className="absolute left-1.5 top-5 h-2 w-2 fill-primary text-primary animate-pulse" />
                                        )}
                                        <div className="flex justify-between items-start mb-1">
                                            <p className={cn("text-sm", !n.isRead ? "font-bold text-foreground" : "font-medium text-muted-foreground")}>
                                                {n.title}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                {new Date(n.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                            {n.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-2 border-t border-border/50 bg-muted/10">
                        <Button variant="ghost" className="w-full h-8 text-[11px] font-bold uppercase tracking-widest text-muted-foreground" onClick={onClose}>
                            Close Panel
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}