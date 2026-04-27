import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    RefreshCcw,
    Plus,
    Search,
    ClipboardList,
    LifeBuoy,
    Filter
} from "lucide-react";
import { ComplaintCard } from "@/components/complaint/ComplaintCard";
import CreateComplaintModal from "@/components/complaint/CreateComplaintModal";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function Complaints() {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [createOpen, setCreateOpen] = useState(false);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const res = await api.get("/complaints");
            setComplaints(res.data.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);

    const filtered = complaints.filter((c: any) =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto py-8 px-4 space-y-8"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <LifeBuoy className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Support Center</h1>
                    </div>
                    <p className="text-muted-foreground">Track your tickets and report issues regarding your stay.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchComplaints}
                        className="bg-background"
                    >
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setCreateOpen(true)}
                        className="gap-2 shadow-sm"
                    >
                        <Plus className="h-4 w-4" /> New Ticket
                    </Button>
                </div>
            </div>

            {/* Stats/Overview Row (Optional but looks great) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-xl border border-dashed text-center">
                    <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Total</p>
                    <p className="text-2xl font-bold">{complaints.length}</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 dark:bg-primary/10 dark:border-primary/20 text-center transition-colors">
                    <p className="text-xs font-bold uppercase text-primary tracking-widest opacity-80">
                        Pending
                    </p>
                    <p className="text-2xl font-bold text-primary">
                        {complaints.filter((c: any) => c.status === "PENDING").length}
                    </p>
                </div>
                {/* ... other stats if needed */}
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-4 bg-card p-2 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title or ticket ID..."
                        className="pl-10 border-none shadow-none focus-visible:ring-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-6 w-[1px] bg-border hidden md:block" />
                <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-muted-foreground">
                    <Filter className="h-4 w-4" /> Filter
                </Button>
            </div>

            {/* List Container */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-xl" />
                        ))
                    ) : filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24 border-2 border-dashed rounded-3xl space-y-4"
                        >
                            <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                                <ClipboardList className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">No tickets found</h3>
                                <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                                    {search ? "Try adjusting your search terms." : "If you're having issues with your room, create a new ticket."}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        filtered.map((c: any) => (
                            <motion.div
                                key={c.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                            >
                                <ComplaintCard
                                    complaint={c}
                                    onClick={() => navigate(`/complaints/${c.id}`)}
                                />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <CreateComplaintModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={fetchComplaints}
            />
        </motion.div>
    );
}