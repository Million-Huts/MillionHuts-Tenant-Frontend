import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { apiPrivate } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Notification {
    id: string;

    title: string;
    message: string;

    type: string;

    entityType?: string | null;
    entityId?: string | null;

    createdAt: string;

    isRead?: boolean;
}

export default function TenantNotificationsPage() {
    const router = useNavigate();

    const [notifications, setNotifications] = useState<
        Notification[]
    >([]);

    const [loading, setLoading] = useState(true);

    /*
    ===============================
    FETCH
    ===============================
    */

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const res = await apiPrivate.get("/notifications");

            setNotifications(res.data.data || []);
        } catch {
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    /*
    ===============================
    REDIRECT
    ===============================
    */

    const handleRedirect = (n: Notification) => {
        if (!n.entityType || !n.entityId) return;

        switch (n.entityType) {
            case "COMPLAINT":
                router(`/complaints/${n.entityId}`);
                break;

            case "PAYMENT":
                router(`/payments/${n.entityId}`);
                break;

            default:
                break;
        }
    };

    /*
    ===============================
    MARK READ
    ===============================
    */

    const markAsRead = async (id: string) => {
        try {
            await apiPrivate.patch(
                `/notifications/${id}/read`
            );

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id
                        ? { ...n, isRead: true }
                        : n
                )
            );
        } catch {
            toast.error("Failed");
        }
    };

    /*
    ===============================
    MARK ALL
    ===============================
    */

    const markAll = async () => {
        try {
            await apiPrivate.patch(
                `/notifications/read-all`
            );

            setNotifications((prev) =>
                prev.map((n) => ({
                    ...n,
                    isRead: true,
                }))
            );

            toast.success("All marked as read");
        } catch {
            toast.error("Failed");
        }
    };

    /*
    ===============================
    DELETE
    ===============================
    */

    const deleteNotification = async (
        id: string
    ) => {
        try {
            await apiPrivate.delete(
                `/notifications/${id}`
            );

            setNotifications((prev) =>
                prev.filter((n) => n.id !== id)
            );
        } catch {
            toast.error("Failed");
        }
    };

    /*
    ===============================
    UI
    ===============================
    */

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">

                <h1 className="text-lg font-semibold">
                    Notifications
                </h1>

                <Button size="sm" onClick={markAll}>
                    Mark All
                </Button>
            </div>

            {/* LIST */}
            <div className="space-y-3">

                {loading && (
                    <div className="text-center py-10">
                        Loading...
                    </div>
                )}

                {!loading &&
                    notifications.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No notifications yet
                        </div>
                    )}

                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className={`border rounded-xl p-4 space-y-2 ${!n.isRead
                            ? "bg-blue-50 border-blue-200"
                            : ""
                            }`}
                    >
                        <div
                            onClick={() =>
                                handleRedirect(n)
                            }
                            className="cursor-pointer space-y-2"
                        >
                            <div className="flex justify-between items-center">

                                <div className="font-medium text-sm">
                                    {n.title}
                                </div>

                                {!n.isRead && (
                                    <span className="text-xs text-blue-600">
                                        New
                                    </span>
                                )}
                            </div>

                            <div className="text-sm text-muted-foreground">
                                {n.message}
                            </div>

                            <div className="text-xs text-muted-foreground">
                                {new Date(
                                    n.createdAt
                                ).toLocaleString()}
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2 pt-2">

                            {!n.isRead && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        markAsRead(n.id)
                                    }
                                >
                                    Mark Read
                                </Button>
                            )}

                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                    deleteNotification(n.id)
                                }
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}