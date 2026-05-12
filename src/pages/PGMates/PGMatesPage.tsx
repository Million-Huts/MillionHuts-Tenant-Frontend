import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users2, ShieldCheck, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

import { apiPrivate } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

import MatesGrid from "@/components/pgmates/MatesGrid";
import MatesSearchBar from "@/components/pgmates/MatesSearchBar";
import EmptyMatesState from "@/components/pgmates/EmptyMatesState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import type { PGMate } from "@/types/pgmates";

// ============================================================
// TODO: Replace with actual API endpoint once backend is ready.
// Expected response: { data: PGMate[], total: number }
// The pgId is available from stayRecords.pgId
// ============================================================

export default function PGMatesPage() {
    const { stayRecords } = useAuth();

    const [mates, setMates] = useState<PGMate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [floorFilter, setFloorFilter] = useState("ALL");

    const pgId = stayRecords?.pgId;
    const pgName = stayRecords?.pg?.name;

    // ============================================================
    // FETCH
    // ============================================================
    const fetchMates = async () => {
        if (!pgId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const res = await apiPrivate.get(`tenant/me/pg-mates`);
            setMates(res.data?.data || []);
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to load housemates";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMates();
    }, [pgId]);

    // ============================================================
    // DERIVED DATA
    // ============================================================

    // Unique floors from mates list for filter pills
    const floors = useMemo(() => {
        const seen = new Map<string, { id: string; label: string }>();
        mates.forEach((m) => {
            if (m.floor && !seen.has(m.floor.id)) {
                seen.set(m.floor.id, m.floor);
            }
        });
        return Array.from(seen.values());
    }, [mates]);

    // Filtered mates
    const filteredMates = useMemo(() => {
        return mates.filter((m) => {
            const matchesSearch = m.fullName
                .toLowerCase()
                .includes(search.toLowerCase());
            const matchesFloor =
                floorFilter === "ALL" || m.floor?.id === floorFilter;
            return matchesSearch && matchesFloor;
        });
    }, [mates, search, floorFilter]);

    const verifiedCount = mates.filter((m) => m.kycVerified).length;
    const hasFilters = search.length > 0 || floorFilter !== "ALL";

    // ============================================================
    // NO STAY STATE
    // ============================================================
    if (!pgId) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 px-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                    <Users2 className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <div>
                    <p className="font-bold text-foreground">No active stay</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        You need an active PG stay to view your housemates.
                    </p>
                </div>
            </div>
        );
    }

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto py-8 px-4 space-y-8"
        >
            {/* ===== PAGE HEADER ===== */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Users2 className="h-5 w-5 text-primary" />
                        <h1 className="text-2xl font-black tracking-tight text-foreground">
                            PG Mates
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Your verified housemates at{" "}
                        <span className="font-semibold text-foreground">
                            {pgName || "your PG"}
                        </span>
                    </p>
                </div>

                {/* Refresh button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchMates}
                    disabled={loading}
                    className="self-start gap-2 rounded-xl"
                >
                    <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* ===== STATS ROW ===== */}
            {!loading && mates.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-card border border-border text-center">
                        <p className="text-2xl font-black text-foreground">{mates.length}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            Total Housemates
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            {verifiedCount}
                        </p>
                        <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium mt-0.5 flex items-center justify-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> KYC Verified
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-border text-center col-span-2 sm:col-span-1">
                        <p className="text-2xl font-black text-foreground">{floors.length}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            Floors Occupied
                        </p>
                    </div>
                </div>
            )}

            {/* ===== SEARCH + FILTER ===== */}
            {!loading && mates.length > 0 && (
                <MatesSearchBar
                    search={search}
                    onSearchChange={setSearch}
                    floorFilter={floorFilter}
                    onFloorChange={setFloorFilter}
                    floors={floors}
                    totalCount={mates.length}
                    filteredCount={filteredMates.length}
                />
            )}

            {/* ===== CONTENT ===== */}
            {loading ? (
                // Skeleton loading state
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-[140px] rounded-2xl" />
                    ))}
                </div>
            ) : error ? (
                // Error state
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <p className="font-bold text-destructive">{error}</p>
                    <Button variant="outline" onClick={fetchMates} className="rounded-xl gap-2">
                        <RefreshCcw className="h-4 w-4" /> Try Again
                    </Button>
                </div>
            ) : filteredMates.length === 0 ? (
                <EmptyMatesState hasFilters={hasFilters} />
            ) : (
                <MatesGrid mates={filteredMates} />
            )}

            {/* ===== PRIVACY NOTE ===== */}
            {!loading && mates.length > 0 && (
                <div className="flex items-center justify-center gap-2 py-4 border-t border-border">
                    <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground text-center">
                        Only name, room, and verification status are visible. Full privacy maintained.
                    </p>
                </div>
            )}
        </motion.div>
    );
}
