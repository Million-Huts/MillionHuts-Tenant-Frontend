import {
    LayoutDashboard,
    User,
    LogOut,
    ChevronLeft,
    Home,
    CreditCard,
    Command,
    X,
    QrCode,
    MessageSquareWarning,
    Bell
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface Props {
    mobileOpen: boolean;
    setMobileOpen: (val: boolean) => void;
}

export default function AppSidebar({ mobileOpen, setMobileOpen }: Props) {
    const location = useLocation();
    const { stayRecords, logout } = useAuth();

    const [collapsed, setCollapsed] = useState(false);

    const hasStay = !!stayRecords;

    /*
    ========================================
    NAV CONFIG (DYNAMIC)
    ========================================
    */

    const navItems = hasStay
        ? [
            { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
            { label: "My PG", icon: Home, to: "/my-pg" },
            { label: "Payments", icon: CreditCard, to: "/payments" },
            { label: "Complaints", icon: MessageSquareWarning, to: "/complaints" },
            { label: "Notifications", icon: Bell, to: "/notifications" },
        ]
        : [
            { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
            { label: "Scan QR", icon: QrCode, to: "/scan" },
        ];

    const bottomNav = [
        { label: "Profile", icon: User, to: "/profile" },
    ];

    /*
    ========================================
    CLOSE MOBILE ON RESIZE
    ========================================
    */

    useEffect(() => {
        const update = () => setMobileOpen(false);
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [setMobileOpen]);

    /*
    ========================================
    NAV LINK
    ========================================
    */

    const NavLink = ({ item }: { item: any }) => {
        const active = location.pathname === item.to;

        return (
            <Link
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group",
                    active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed && "justify-center px-2"
                )}
            >
                <item.icon
                    className={cn(
                        "h-5 w-5 shrink-0",
                        active && "text-white"
                    )}
                />

                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            className="truncate"
                        >
                            {item.label}
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* Tooltip for collapsed */}
                {collapsed && (
                    <div className="absolute left-14 hidden group-hover:block z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background whitespace-nowrap">
                        {item.label}
                    </div>
                )}
            </Link>
        );
    };

    /*
    ========================================
    SIDEBAR
    ========================================
    */

    const sidebarVariants = {
        expanded: { width: "260px" },
        collapsed: { width: "80px" },
    };

    const sidebarContent = (
        <motion.div
            initial={false}
            animate={collapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            className="relative flex h-full flex-col bg-sidebar border-r border-sidebar-border"
        >
            {/* Logo */}
            <div className="flex h-16 items-center px-4">
                <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Command className="h-5 w-5" />
                    </div>
                    {!collapsed && (
                        <span className="text-lg font-bold text-sidebar-foreground">
                            MillionHuts
                        </span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
                {!collapsed && (
                    <p className="px-3 text-[10px] font-bold uppercase text-muted-foreground mt-4">
                        Navigation
                    </p>
                )}

                {navItems.map((item) => (
                    <NavLink key={item.to} item={item} />
                ))}
            </nav>

            {/* Bottom */}
            <div className="border-t p-3 space-y-1">
                {bottomNav.map((item) => (
                    <NavLink key={item.to} item={item} />
                ))}

                <Button
                    variant="ghost"
                    onClick={logout}
                    className={cn(
                        "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                        collapsed && "justify-center px-0"
                    )}
                >
                    <LogOut className="h-5 w-5" />
                    {!collapsed && <span>Sign Out</span>}
                </Button>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 hidden md:flex h-6 w-6 items-center justify-center rounded-full border bg-background"
                >
                    <ChevronLeft
                        className={cn(
                            "h-4 w-4 transition-transform",
                            collapsed && "rotate-180"
                        )}
                    />
                </button>
            </div>
        </motion.div>
    );

    /*
    ========================================
    RENDER
    ========================================
    */

    return (
        <>
            {/* Desktop */}
            <aside className="hidden md:flex h-screen sticky top-0">
                {sidebarContent}
            </aside>

            {/* Mobile */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-background border-r transform transition-transform md:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center justify-between px-6 border-b">
                    <span className="font-bold text-lg">MillionHuts</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex flex-col h-[calc(100%-64px)] p-4 space-y-4">
                    <div className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <NavLink key={item.to} item={item} />
                        ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                        {bottomNav.map((item) => (
                            <NavLink key={item.to} item={item} />
                        ))}

                        <Button
                            variant="destructive"
                            className="w-full justify-start gap-3"
                            onClick={logout}
                        >
                            <LogOut className="h-5 w-5" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}