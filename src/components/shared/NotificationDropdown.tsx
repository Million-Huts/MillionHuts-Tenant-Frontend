import { useEffect, useState } from "react";
import { CheckCheck } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";

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

    if (!open) return null;

    return (
        <div className="absolute right-4 top-16 w-80 bg-background border rounded-xl shadow-lg z-50">
            <div className="flex items-center justify-between p-3 border-b">
                <h4 className="text-sm font-bold">Notifications</h4>
                <Button size="sm" variant="ghost" onClick={markAllRead}>
                    <CheckCheck size={16} />
                </Button>
            </div>

            <div className="max-h-80 overflow-y-auto">
                {loading ? (
                    <p className="p-4 text-sm text-muted-foreground">Loading...</p>
                ) : notifications.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">No notifications</p>
                ) : (
                    notifications.map(n => (
                        <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${!n.isRead ? "bg-muted/30" : ""
                                }`}
                        >
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}