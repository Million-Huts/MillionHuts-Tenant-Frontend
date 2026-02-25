import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Plus, Search, ClipboardList } from "lucide-react";
import { ComplaintCard } from "@/components/complaint/ComplaintCard";
import CreateComplaintModal from "@/components/complaint/CreateComplaintModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function ComplaintsPage() {
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
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">

                {/* Header Area */}
                <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">Support</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Help & Complaints</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={fetchComplaints} className="rounded-full">
                        <RefreshCcw className={`h-5 w-5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {/* Action Bar */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Find a ticket..."
                            className="pl-10 rounded-2xl bg-white border-none shadow-sm h-12"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button
                        className="rounded-2xl h-12 px-6 font-bold shadow-indigo-100 shadow-lg"
                        onClick={() => setCreateOpen(true)}
                    >
                        <Plus className="h-5 w-5 mr-1" /> New
                    </Button>
                </div>

                {/* List Container */}
                <div className="space-y-3">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 space-y-4">
                            <div className="bg-slate-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                                <ClipboardList className="h-8 w-8 text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase text-[10px]">No issues found</p>
                        </div>
                    ) : (
                        filtered.map((c: any) => (
                            <ComplaintCard
                                key={c.id}
                                complaint={c}
                                onClick={() => navigate(`/complaints/${c.id}`)}
                            />
                        ))
                    )}
                </div>

                <CreateComplaintModal
                    open={createOpen}
                    onClose={() => setCreateOpen(false)}
                    onCreated={fetchComplaints}
                />
            </div>
        </div>
    );
}