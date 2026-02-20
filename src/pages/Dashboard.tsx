import { useEffect, useState } from "react";
import JoinPG from "@/components/dashboard/JoinPG";
import ApplicationsList from "@/components/dashboard/ApplicationsList";
import ActiveStay from "@/components/dashboard/ActiveStay";
import { apiPrivate } from "@/lib/api";
import type { TenantApplication } from "@/types/application";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { stayRecords, loading: authLoading } = useAuth();
    const [applications, setApplications] = useState<TenantApplication[]>([]);
    const [isLoadingApps, setIsLoadingApps] = useState(true);

    const hasStay = !!stayRecords;

    useEffect(() => {
        const fetchApplications = async () => {
            if (hasStay) {
                setIsLoadingApps(false);
                return;
            }
            try {
                const res = await apiPrivate.get("/applications");
                setApplications(res.data?.data || []);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setIsLoadingApps(false);
            }
        };

        if (!authLoading) {
            fetchApplications();
        }
    }, [hasStay, authLoading]);

    if (authLoading || isLoadingApps) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Building your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section can go here if needed */}

            {hasStay ? (
                <ActiveStay stay={stayRecords} />
            ) : applications.length > 0 ? (
                <ApplicationsList applications={applications} />
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <JoinPG />
                </div>
            )}
        </div>
    );
}