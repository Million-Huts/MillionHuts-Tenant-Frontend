import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";

export default function CreateComplaintModal({ open, onClose, onCreated }: any) {
    const [loading, setLoading] = useState(false);
    const { stayRecords } = useAuth();
    const [files, setFiles] = useState<File[]>([]);
    const [form, setForm] = useState({ title: "", description: "", category: "OTHER", priority: "MEDIUM" });

    const categories = ["ELECTRICAL", "PLUMBING", "CLEANING", "INTERNET", "FOOD", "SECURITY", "MAINTENANCE", "OTHER"];
    const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

    const submit = async () => {
        if (!form.title || !form.description) return toast.error("Title and Description are required");
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([k, v]) => formData.append(k, v));
            files.forEach((f) => formData.append("media", f));
            if (stayRecords?.pgId) formData.append('pgId', stayRecords.pgId);

            await api.post("/complaints", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Ticket raised successfully");
            onCreated();
            onClose();
        } catch {
            toast.error("Failed to raise ticket");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black">Raise a Concern</DialogTitle>
                    <DialogDescription>Let us know what's wrong. We'll get it fixed.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-black uppercase text-slate-500">Issue Title</Label>
                        <Input placeholder="Briefly describe the issue" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="rounded-xl" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-black uppercase text-slate-500">Category</Label>
                            <Select onValueChange={v => setForm({ ...form, category: v })} defaultValue={form.category}>
                                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-black uppercase text-slate-500">Priority</Label>
                            <Select onValueChange={v => setForm({ ...form, priority: v })} defaultValue={form.priority}>
                                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-black uppercase text-slate-500">Full Description</Label>
                        <Textarea placeholder="Provide details like room number or specific location..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-xl min-h-[100px]" />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-black uppercase text-slate-500">Attach Media (Optional)</Label>
                        <div className="flex flex-wrap gap-2">
                            <label className="h-16 w-16 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors">
                                <Upload className="h-5 w-5 text-slate-400" />
                                <input type="file" multiple hidden accept="image/*,video/*" onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files || [])])} />
                            </label>
                            {files.map((f, i) => (
                                <div key={i} className="h-16 w-16 bg-slate-100 rounded-xl relative flex items-center justify-center p-1 overflow-hidden border">
                                    <span className="text-[8px] font-bold text-center truncate">{f.name}</span>
                                    <X className="absolute top-0 right-0 h-4 w-4 bg-rose-500 text-white rounded-full p-0.5 cursor-pointer" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button onClick={submit} disabled={loading} className="w-full rounded-xl h-12 font-black shadow-lg shadow-indigo-100">
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Submit Complaint"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}