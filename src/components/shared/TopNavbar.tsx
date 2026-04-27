import { Menu, User, Bell, ChevronRight, Search } from "lucide-react";
import { matchPath, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { apiPrivate } from "@/lib/api";

import NotificationDropdown from "./NotificationDropdown";
import { ThemeToggle } from "../ui/ThemeToggle";

const pageMetaConfig = [
    { pattern: "/dashboard", title: "Home", desc: "Overview" },
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
        // Refresh every 2 mins
        const interval = setInterval(fetchUnread, 120000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-border/40 bg-background/60 px-4 backdrop-blur-xl md:px-8">
            {/* LEFT: Contextual Info */}
            <div className="flex items-center gap-4">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="lg:hidden rounded-xl border"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="hidden sm:flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                        <span>MillionHuts</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-primary">{activeMeta.title}</span>
                    </div>
                    <h1 className="text-xl font-black tracking-tight text-foreground">
                        {activeMeta.title === "Home" ? `Welcome, ${tenant?.fullName?.split(" ")[0]}` : activeMeta.title}
                    </h1>
                </div>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center bg-muted/50 border border-border/40 rounded-full px-3 py-1.5 mr-2">
                    <Search className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-xs text-muted-foreground pr-8">Search anything...</span>
                    <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>

                <ThemeToggle />

                {/* Notifications Wrapper */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setNotifOpen(!notifOpen)}
                        className={cn(
                            "relative rounded-full transition-all",
                            notifOpen ? "bg-primary/10 text-primary scale-110" : "hover:bg-muted"
                        )}
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 h-4 min-w-[16px] flex items-center justify-center text-[10px] font-bold bg-primary text-white border-2 border-background rounded-full px-1">
                                {unreadCount}
                            </span>
                        )}
                    </Button>

                    <NotificationDropdown
                        open={notifOpen}
                        onClose={() => setNotifOpen(false)}
                    />
                </div>

                {/* User Profile Summary */}
                <div className="flex items-center gap-3 pl-3 border-l border-border/40 ml-1">
                    <div className="hidden lg:flex flex-col items-end">
                        <span className="text-xs font-black tracking-tight leading-none mb-1">
                            {tenant?.fullName}
                        </span>
                        <div className={cn(
                            "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider",
                            hasStay ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        )}>
                            <span className={cn("h-1 w-1 rounded-full animate-pulse", hasStay ? "bg-emerald-600" : "bg-amber-600")} />
                            {hasStay ? "Active" : "Pending"}
                        </div>
                    </div>

                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20 group hover:border-primary transition-all cursor-pointer overflow-hidden">
                        {tenant?.profileImage ? (
                            <img src={tenant.profileImage} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <User size={20} className="text-primary group-hover:scale-110 transition-transform" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;