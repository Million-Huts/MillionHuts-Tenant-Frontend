import { Menu, User, Bell, ChevronRight } from "lucide-react";
import { matchPath, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const pageMetaConfig = [
    { pattern: "/dashboard", title: "Home", desc: "Your daily overview" },
    { pattern: "/profile", title: "My Profile", desc: "Manage personal data" },
    { pattern: "/my-pg", title: "My Residence", desc: "Stay details" },
    { pattern: "/payments", title: "Payments", desc: "Rent and dues" },
    { pattern: "/notices", title: "Notice Board", desc: "Latest updates from PG" },
    { pattern: "/scan", title: "QR Scanner", desc: "Join a new property" },
];

interface Props {
    mobileOpen: boolean;
    setMobileOpen: (val: boolean) => void;
}

const TopNavbar = ({ mobileOpen, setMobileOpen }: Props) => {
    const location = useLocation();
    const { tenant, stayRecords } = useAuth();
    const hasStay = !!stayRecords;

    const activeMeta = pageMetaConfig.find(route =>
        matchPath({ path: route.pattern, end: true }, location.pathname)
    ) || { title: "MillionHuts", desc: "Tenant App" };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
            <div className="flex items-center gap-4">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="hidden flex-col md:flex">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-0.5 font-medium">
                        <span>MillionHuts</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-primary/80 capitalize">{tenant?.fullName?.split(' ')[0] || 'Tenant'}'s Space</span>
                    </div>
                    <h1 className="text-lg font-bold leading-none tracking-tight">
                        {activeMeta.title}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground relative">
                    <Bell className="h-5 w-5" />
                    {/* Only show ping if there's a reason, like an unjoined PG status */}
                    {!hasStay && (
                        <span className="absolute right-2 top-2 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-600"></span>
                        </span>
                    )}
                </Button>

                <div className="flex items-center gap-3 pl-2 border-l ml-2">
                    <div className="hidden flex-col items-end md:flex">
                        <span className="text-sm font-bold">{tenant?.fullName}</span>
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-tighter",
                            hasStay ? "text-green-600" : "text-orange-600"
                        )}>
                            {hasStay ? "Active Stay" : "Pending Join"}
                        </span>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <User size={18} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;