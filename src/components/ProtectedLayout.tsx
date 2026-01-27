import { Outlet } from "react-router-dom";
import AppSidebar from "./common/AppSidebar";
import TopNavbar from "./common/TopNavbar";
import { useState } from "react";

const ProtectedLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen">
            <AppSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <main className="flex-1 bg-gray-50">
                <TopNavbar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className="p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ProtectedLayout;
