import { Menu, User, Bell, ChevronRight } from "lucide-react";
import { matchPath, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { apiPrivate } from "@/lib/api";

import NotificationDropdown from "./NotificationDropdown";
import { ThemeToggle } from "../ui/ThemeToggle";

const pageMetaConfig = [
    { pattern: "/dashboard", title: "Home", desc: "Your daily overview" },
    { pattern: "/profile", title: "My Profile" },
    { pattern: "/my-pg", title: "My Residence" },
    { pattern: "/payments", title: "Payments" },
    { pattern: "/scan", title: "QR Scanner" },
];

interface Props {
    mobileOpen: boolean;
    setMobileOpen: (val: boolean) => void;
}

const TopNavbar = ({ mobileOpen, setMobileOpen }: Props) => {
    const location = useLocation();
    const { tenant, stayRecords } = useAuth();

    const [notifOpen, setNotifOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const hasStay = !!stayRecords;

    const activeMeta =
        pageMetaConfig.find(route =>
            matchPath({ path: route.pattern, end: true }, location.pathname)
        ) || { title: "MillionHuts" };

    const fetchUnread = async () => {
        try {
            const res = await apiPrivate.get("/notifications/unread-count");
            setUnreadCount(res.data?.unreadCount || 0);
        } catch { }
    };

    useEffect(() => {
        fetchUnread();
    }, []);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
            {/* LEFT */}
            <div className="flex items-center gap-4">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="hidden md:flex flex-col">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>MillionHuts</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-primary/80">
                            {tenant?.fullName?.split(" ")[0] || "Tenant"}
                        </span>
                    </div>
                    <h1 className="text-lg font-bold">
                        {activeMeta.title}
                    </h1>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 md:gap-4 relative">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setNotifOpen(prev => !prev)}
                    className="relative"
                >
                    <Bell className="h-5 w-5" />

                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </Button>

                <NotificationDropdown
                    open={notifOpen}
                    onClose={() => setNotifOpen(false)}
                />

                {/* User */}
                <div className="flex items-center gap-3 pl-2 border-l">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold">
                            {tenant?.fullName}
                        </span>
                        <span
                            className={cn(
                                "text-[10px] font-bold uppercase",
                                hasStay ? "text-green-600" : "text-orange-600"
                            )}
                        >
                            {hasStay ? "Active Stay" : "Pending Join"}
                        </span>
                    </div>

                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border">
                        <User size={18} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
