// components/common/TopNavbar.tsx
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavbarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (val: boolean) => void;
}

const TopNavbar = ({ sidebarOpen, setSidebarOpen }: TopNavbarProps) => {
    return (
        <div className="w-full border-b bg-background px-4 py-3 flex items-center gap-3">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <Menu className="w-5 h-5" />
                </Button>
            </div>

            {/* App Title */}
            <h1 className="text-lg font-semibold">MillionHuts</h1>
        </div>
    );
};

export default TopNavbar;
