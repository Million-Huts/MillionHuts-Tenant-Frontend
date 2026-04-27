import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
    ChevronLeft,
    MessageSquare,
    History as HistoryIcon,
    Image as ImageIcon,
    X,
    Paperclip,
    RefreshCcw,
    Maximize2,
    AlertCircle
} from "lucide-react";

import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// --- Types ---
interface Media { id: string; fileUrl: string; fileType: string; }
interface Comment { id: string; message: string; createdAt: string; media: Media[]; authorType?: "TENANT" | "ADMIN" | "STAFF"; }
interface Activity { id: string; action: string; createdAt: string; }
interface Complaint {
    id: string; title: string; description: string; status: string;
    priority: string; category: string; createdAt: string;
    media: Media[]; comments: Comment[]; activities: Activity[];
}

const statusStyles: Record<string, string> = {
    OPEN: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    IN_PROGRESS: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    CLOSED: "bg-muted text-muted-foreground border-border",
    REOPENED: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export default function ComplaintDetailsPage() {
    const { complaintId } = useParams();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [commentFiles, setCommentFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    const fetchComplaint = async () => {
        try {
            const res = await apiPrivate.get(`complaints/${complaintId}`);
            setComplaint(res.data.data);
        } catch {
            toast.error("Failed to load details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaint(); }, [complaintId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [complaint?.comments]);

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
            toast.success("Ticket Reopened");
            fetchComplaint();
        } catch { toast.error("Action failed"); }
    };

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest">Loading Ticket...</p>
        </div>
    );

    if (!complaint) return <div className="p-20 text-center font-bold text-muted-foreground">Ticket not found.</div>;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Nav */}
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
                        <ChevronLeft className="h-4 w-4" /> Back
                    </Button>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cn("font-bold tracking-wider px-3 py-1 uppercase text-[10px]", statusStyles[complaint.status])}>
                            {complaint.status.replace("_", " ")}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 pt-8 space-y-10">
                {/* 1. Main Issue Section */}
                <section className="bg-card p-6 md:p-8 rounded-[2rem] border shadow-sm space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{complaint.category}</span>
                        </div>
                        <h1 className="text-3xl font-black text-card-foreground tracking-tight leading-tight">
                            {complaint.title}
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {complaint.description}
                        </p>
                    </div>

                    {complaint.media.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            {complaint.media.map((m) => (
                                <MediaThumbnail key={m.id} url={m.fileUrl} onClick={() => setSelectedImg(m.fileUrl)} />
                            ))}
                        </div>
                    )}
                </section>

                {/* 2. Discussion Section */}
                <section className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 font-black text-xl text-foreground">
                            <MessageSquare className="h-5 w-5 text-primary" /> Discussion
                        </h2>
                        <Badge variant="secondary" className="font-bold text-[10px] uppercase">
                            {complaint.comments?.length || 0} Messages
                        </Badge>
                    </div>

                    <div className="space-y-6">
                        {complaint.comments?.map((c) => (
                            <div key={c.id} className={cn("flex flex-col space-y-2 max-w-[90%] md:max-w-[80%]", c.authorType === "TENANT" ? "ml-auto items-end" : "mr-auto items-start")}>
                                <div className={cn("p-4 rounded-3xl shadow-sm border",
                                    c.authorType === "TENANT"
                                        ? "bg-primary text-primary-foreground rounded-tr-none border-primary"
                                        : "bg-card text-card-foreground rounded-tl-none border-border")}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{c.message}</p>
                                    {c.media && c.media.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {c.media.map(m => (
                                                <div key={m.id} onClick={() => setSelectedImg(m.fileUrl)} className="h-14 w-14 rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:opacity-80">
                                                    <img src={m.fileUrl} className="h-full w-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-2">
                                    {c.authorType === "TENANT" ? "You" : "Management"} • {format(new Date(c.createdAt), "h:mm a")}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* 4. INLINE COMMENT BOX */}
                    <div className="pt-8 border-t border-border">
                        {["RESOLVED", "CLOSED"].includes(complaint.status) ? (
                            <Button onClick={reopenComplaint} variant="outline" className="w-full h-14 rounded-2xl bg-orange-500/5 text-orange-600 hover:bg-orange-500/10 font-bold border-orange-500/20">
                                <RefreshCcw className="h-4 w-4 mr-2" /> Reopen Ticket
                            </Button>
                        ) : (
                            <div className="space-y-4 bg-card p-4 rounded-[2rem] border border-border shadow-md">
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a reply..."
                                    className="w-full bg-muted/50 rounded-2xl border-none focus:ring-2 ring-primary/20 p-4 text-sm min-h-[100px] resize-none placeholder:text-muted-foreground"
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); } }}
                                />

                                {commentFiles.length > 0 && (
                                    <div className="flex flex-wrap gap-2 px-2">
                                        {commentFiles.map((_, i) => (
                                            <div key={i} className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center relative border border-border group">
                                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                <button onClick={() => setCommentFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-between border-t border-border pt-3">
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-muted px-4 py-2 rounded-xl transition-colors text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
                                        <Paperclip className="h-4 w-4" />
                                        Attach
                                        <input type="file" multiple hidden accept="image/*" onChange={(e) => setCommentFiles(prev => [...prev, ...Array.from(e.target.files || [])])} />
                                    </label>

                                    <Button
                                        disabled={submitting || (!commentText.trim() && !commentFiles.length)}
                                        onClick={submitComment}
                                        className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20"
                                    >
                                        {submitting ? <RefreshCcw className="animate-spin h-4 w-4" /> : "Send Reply"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div ref={scrollRef} />
                </section>

                {/* 3. History Accordion */}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="history" className="border-none px-4 bg-muted/40 rounded-2xl">
                        <AccordionTrigger className="hover:no-underline py-4 text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <HistoryIcon className="h-4 w-4" /> View Audit Log
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6">
                            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
                                {complaint.activities?.map((a) => (
                                    <div key={a.id} className="relative pl-6">
                                        <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-background border-2 border-muted flex items-center justify-center">
                                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">{a.action}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">{format(new Date(a.createdAt), "MMM d, h:mm a")}</p>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <Dialog open={!!selectedImg} onOpenChange={() => setSelectedImg(null)}>
                <DialogContent className="max-w-[95vw] md:max-w-5xl p-0 overflow-hidden bg-background/95 border-none backdrop-blur-xl">
                    <DialogTitle className="sr-only">Preview</DialogTitle>
                    <div className="relative w-full h-full flex items-center justify-center p-4 min-h-[50vh]">
                        <img src={selectedImg || ""} className="max-h-[85vh] w-auto object-contain rounded-lg shadow-2xl" alt="Full preview" />
                        <Button variant="outline" size="icon" onClick={() => setSelectedImg(null)} className="absolute top-4 right-4 rounded-full bg-background/50">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function MediaThumbnail({ url, onClick }: { url: string; onClick: () => void }) {
    return (
        <div onClick={onClick} className="group relative aspect-square bg-muted rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all cursor-zoom-in">
            <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="h-5 w-5 text-white" />
            </div>
        </div>
    );
}