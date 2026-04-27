import { Outlet } from "react-router-dom";
import { useState } from "react";

import AppSidebar from "./shared/AppSidebar";
import TopNavbar from "./shared/TopNavbar";

const ProtectedLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <AppSidebar
                mobileOpen={sidebarOpen}
                setMobileOpen={setSidebarOpen}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <TopNavbar
                    mobileOpen={sidebarOpen}
                    setMobileOpen={setSidebarOpen}
                />

                {/* Page Content */}
                <div className="flex-1 p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ProtectedLayout;