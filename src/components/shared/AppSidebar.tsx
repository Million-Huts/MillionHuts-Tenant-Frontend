import {
    LayoutDashboard,
    User,
    LogOut,
    Home,
    CreditCard,
    X,
    QrCode,
    MessageSquareWarning,
    Bell,
    Settings,
    Sparkles,
    Users2,
} from "lucide-react";
import { useEffect } from "react";
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

    const hasStay = !!stayRecords;

    const navItems = hasStay
        ? [
            { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
            { label: "My PG", icon: Home, to: "/my-pg" },
            { label: "PG Mates", icon: Users2, to: "/pg-mates" },
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
        { label: "Settings", icon: Settings, to: "/settings" },
    ];

    // Close mobile sidebar on resize if it's open
    useEffect(() => {
        const update = () => setMobileOpen(false);
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [setMobileOpen]);

    const NavLink = ({ item }: { item: any }) => {
        const active = location.pathname === item.to;

        return (
            <Link
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                    "relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all group",
                    active
                        ? "text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
            >
                {active && (
                    <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-primary rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                )}
                <item.icon className={cn("h-5 w-5 shrink-0 z-10", active && "text-primary-foreground")} />
                <span className="truncate z-10">{item.label}</span>
            </Link>
        );
    };

    const SidebarInner = () => (
        <div className="flex h-full flex-col bg-card/40 backdrop-blur-xl border-r border-border/40">
            {/* Brand Header */}
            <div className="flex h-20 items-center px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-lg">
                        {/* <Command className="h-6 w-6" /> */}
                        <img src="/logo-2.png" alt="logo" />
                    </div>
                    <div>
                        <span className="text-lg font-black tracking-tight text-foreground block leading-none">
                            MillionHuts
                        </span>
                        {hasStay && (
                            <span className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1 mt-1">
                                <Sparkles className="h-2 w-2" /> Active Stay
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
                <p className="px-4 text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.2em] mb-4">
                    Main Menu
                </p>
                {navItems.map((item) => (
                    <NavLink key={item.to} item={item} />
                ))}
            </nav>

            {/* Account & Bottom Section */}
            <div className="mt-auto border-t border-border/40 p-4 space-y-1 bg-muted/10">
                <p className="px-4 text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.2em] mb-2">
                    Account
                </p>
                {bottomNav.map((item) => (
                    <NavLink key={item.to} item={item} />
                ))}
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full h-11 justify-start gap-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors px-4"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium text-sm">Sign Out</span>
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop View: Static Sidebar */}
            <aside className="hidden lg:block w-[280px] h-screen sticky top-0 z-40">
                <SidebarInner />
            </aside>

            {/* Mobile View: Slide-in Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Dark Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-[70] w-[280px] lg:hidden"
                        >
                            <SidebarInner />
                            {/* Close Button Inside Drawer */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileOpen(false)}
                                className="absolute right-4 top-5 rounded-full lg:hidden"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}