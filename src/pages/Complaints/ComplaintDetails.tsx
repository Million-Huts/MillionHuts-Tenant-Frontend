import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
    ChevronLeft,
    MessageSquare,
    History,
    Image as ImageIcon,
    X,
    Send,
    Paperclip,
    RefreshCcw,
    Clock,
    Maximize2
} from "lucide-react";

import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// --- Types ---
interface Media { id: string; fileUrl: string; fileType: string; }
interface Comment { id: string; message: string; createdAt: string; media: Media[]; authorType?: string; }
interface Activity { id: string; action: string; createdAt: string; }
interface Complaint {
    id: string; title: string; description: string; status: string;
    priority: string; category: string; createdAt: string;
    media: Media[]; comments: Comment[]; activities: Activity[];
}

const statusStyles: Record<string, string> = {
    OPEN: "bg-amber-100 text-amber-700 border-amber-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
    RESOLVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CLOSED: "bg-slate-100 text-slate-700 border-slate-200",
    REOPENED: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function ComplaintDetailsPage() {
    const { complaintId } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [commentFiles, setCommentFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // Lightbox State
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    const fetchComplaint = async () => {
        try {
            const res = await apiPrivate.get(`complaints/${complaintId}`);
            setComplaint(res.data);
        } catch {
            toast.error("Failed to load details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaint(); }, [complaintId]);

    const submitComment = async () => {
        if (!commentText.trim() && !commentFiles.length) return;
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("message", commentText);
            commentFiles.forEach((f) => formData.append("media", f));
            await apiPrivate.post(`complaints/${complaintId}/comments`, formData);
            setCommentText("");
            setCommentFiles([]);
            toast.success("Message sent");
            fetchComplaint();
        } catch {
            toast.error("Failed to send");
        } finally {
            setSubmitting(false);
        }
    };

    const reopenComplaint = async () => {
        try {
            await apiPrivate.patch(`complaints/${complaintId}/reopen`);
            toast.success("Reopened");
            fetchComplaint();
        } catch { toast.error("Action failed"); }
    };

    if (loading) return <ComplaintSkeleton />;
    if (!complaint) return <div className="p-10 text-center">Complaint not found.</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-32">
            {/* STICKY TOP NAV */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b p-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-full">
                        <ChevronLeft className="h-5 w-5 mr-1" /> Back
                    </Button>
                    <Badge variant="outline" className={`font-bold ${statusStyles[complaint.status]}`}>
                        {complaint.status}
                    </Badge>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-4 space-y-8">
                {/* HEADER SECTION */}
                <section className="space-y-3">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{complaint.title}</h1>
                    <p className="text-slate-600 text-lg leading-relaxed">{complaint.description}</p>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(complaint.createdAt), "PPP p")}</span>
                        <span className="bg-slate-200/50 px-2 py-0.5 rounded text-slate-600">{complaint.category}</span>
                    </div>
                </section>

                {/* COMPLAINT MEDIA GRID */}
                {complaint.media.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                        {complaint.media.map((m) => (
                            <div
                                key={m.id}
                                onClick={() => setSelectedImg(m.fileUrl)}
                                className="group relative aspect-square bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all cursor-zoom-in shadow-sm"
                            >
                                <img src={m.fileUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Maximize2 className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TIMELINE / HISTORY */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <History className="h-4 w-4" /> <h2>History</h2>
                    </div>
                    <Card className="p-5 border-none shadow-sm rounded-3xl space-y-6 relative overflow-hidden">
                        <div className="absolute left-[31px] top-8 bottom-8 w-[2px] bg-slate-100" />
                        {complaint.activities?.map((a) => (
                            <div key={a.id} className="relative pl-10">
                                <div className="absolute left-0 top-0.5 h-6 w-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
                                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                                </div>
                                <p className="text-sm text-slate-700 font-semibold">{a.action}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{format(new Date(a.createdAt), "MMM d, h:mm a")}</p>
                            </div>
                        ))}
                    </Card>
                </section>

                {/* DISCUSSION / COMMENTS */}
                <section className="space-y-4 pb-10">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <MessageSquare className="h-4 w-4" /> <h2>Discussion</h2>
                    </div>

                    <div className="space-y-6">
                        {complaint.comments?.map((c) => (
                            <div key={c.id} className="flex flex-col space-y-2 max-w-[90%]">
                                <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm">
                                    <p className="text-sm text-slate-700 leading-relaxed">{c.message}</p>

                                    {/* COMMENT ATTACHMENTS */}
                                    {c.media && c.media.length > 0 && (
                                        <div className="flex gap-2 mt-3">
                                            {c.media.map(m => (
                                                <div
                                                    key={m.id}
                                                    onClick={() => setSelectedImg(m.fileUrl)}
                                                    className="h-16 w-16 rounded-xl overflow-hidden border cursor-zoom-in hover:opacity-80 transition-opacity"
                                                >
                                                    <img src={m.fileUrl} className="h-full w-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">
                                    {format(new Date(c.createdAt), "h:mm a")}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* ACTION FOOTER */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t p-4 pb-8 z-20">
                <div className="max-w-2xl mx-auto space-y-4">
                    {/* Reopen Logic */}
                    {(complaint.status === "RESOLVED" || complaint.status === "CLOSED") && (
                        <Button onClick={reopenComplaint} variant="secondary" className="w-full rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-100 border-none font-bold py-6">
                            <RefreshCcw className="h-4 w-4 mr-2" /> Issue not fixed? Reopen Ticket
                        </Button>
                    )}

                    {/* Input Field */}
                    <div className="flex items-end gap-3">
                        <div className="relative flex-1 bg-slate-100 rounded-[24px] p-3 border border-transparent focus-within:bg-white focus-within:border-slate-200 focus-within:ring-4 ring-indigo-500/5 transition-all">
                            {commentFiles.length > 0 && (
                                <div className="flex gap-2 mb-3">
                                    {commentFiles.map((_, i) => (
                                        <div key={i} className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center relative border border-indigo-200">
                                            <ImageIcon className="h-5 w-5 text-indigo-500" />
                                            <button
                                                onClick={() => setCommentFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-transparent border-none focus:outline-none text-sm px-1 py-1 resize-none max-h-32"
                                rows={1}
                            />
                            <div className="flex justify-between items-center mt-2">
                                <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-200 p-2 rounded-xl transition-colors text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                                    <Paperclip className="h-4 w-4" />
                                    Attach Media
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        onChange={(e) => setCommentFiles(prev => [...prev, ...Array.from(e.target.files || [])])}
                                    />
                                </label>
                            </div>
                        </div>
                        <Button
                            disabled={submitting || (!commentText.trim() && !commentFiles.length)}
                            onClick={submitComment}
                            className="h-14 w-14 rounded-[20px] shadow-xl shadow-indigo-200 shrink-0"
                        >
                            {submitting ? <RefreshCcw className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* LIGHTBOX MODAL */}
            <Dialog open={!!selectedImg} onOpenChange={() => setSelectedImg(null)}>
                <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none focus-visible:outline-none">
                    <DialogTitle className="sr-only">Image Preview</DialogTitle>
                    <div className="relative w-full flex items-center justify-center bg-black/90 md:bg-transparent rounded-3xl overflow-hidden">
                        <img
                            src={selectedImg || ""}
                            className="max-h-[85vh] w-auto object-contain shadow-2xl"
                            alt="Full preview"
                        />
                        <button
                            onClick={() => setSelectedImg(null)}
                            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ComplaintSkeleton() {
    return (
        <div className="max-w-2xl mx-auto p-4 space-y-8 mt-10">
            <div className="space-y-3">
                <Skeleton className="h-10 w-3/4 rounded-xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
            <div className="grid grid-cols-3 gap-3">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="aspect-square rounded-2xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-[40px]" />
        </div>
    );
}