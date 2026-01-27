// components/common/AppSidebar.tsx
import {
    LayoutDashboard,
    User,
    LogOut,
    ChevronLeft,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Profile", icon: User, to: "/profile" },
];

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (val: boolean) => void;
}

export default function AppSidebar({
    sidebarOpen,
    setSidebarOpen,
}: SidebarProps) {
    const location = useLocation();
    const { logout } = useAuth();

    const sidebarContent = (
        <div className="flex h-full flex-col bg-background border-r w-64">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">MillionHuts</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-2 space-y-1">
                {navItems.map(({ label, icon: Icon, to }) => (
                    <Link
                        key={to}
                        to={to}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            location.pathname === to
                                ? "bg-blue-600 text-white"
                                : "hover:bg-muted"
                        )}
                    >
                        <Icon className="w-5 h-5" />
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-2 border-t">
                <Button
                    variant="destructive"
                    className="w-full justify-start gap-2"
                    onClick={logout}
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:flex h-screen">{sidebarContent}</div>

            {/* Mobile Drawer */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div
                        className="h-full w-64 bg-background shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
}
