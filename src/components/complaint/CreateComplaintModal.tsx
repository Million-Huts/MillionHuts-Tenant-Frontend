import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CreateComplaintModal({ open, onClose, onCreated }: any) {
    const [loading, setLoading] = useState(false);
    const { stayRecords } = useAuth();
    const [files, setFiles] = useState<File[]>([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "OTHER",
        priority: "MEDIUM"
    });

    const categories = ["ELECTRICAL", "PLUMBING", "CLEANING", "INTERNET", "FOOD", "SECURITY", "MAINTENANCE", "OTHER"];
    const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

    const submit = async () => {
        if (!form.title || !form.description) return toast.error("Title and Description are required");

        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([k, v]) => formData.append(k, v));
            files.forEach((f) => formData.append("media", f));

            // Contextually grab the current building/PG ID from stayRecords
            if (stayRecords?.pgId) {
                formData.append('pgId', stayRecords.pgId);
            }

            await api.post("/complaints", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Ticket raised successfully");
            setFiles([]); // Reset files
            setForm({ title: "", description: "", category: "OTHER", priority: "MEDIUM" }); // Reset form
            onCreated();
            onClose();
        } catch (err) {
            toast.error("Could not submit. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-primary p-6 text-primary-foreground">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <AlertCircle className="h-6 w-6" /> Raise a Concern
                        </DialogTitle>
                        <DialogDescription className="text-primary-foreground/80">
                            Provide details below and our team will get on it immediately.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <ScrollArea className="max-h-[80vh] p-6">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Issue Title</Label>
                            <Input
                                placeholder="e.g., Kitchen sink leaking"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className="bg-muted/30 focus-visible:ring-primary"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                                <Select onValueChange={v => setForm({ ...form, category: v })} defaultValue={form.category}>
                                    <SelectTrigger className="bg-muted/30 capitalize">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c} value={c} className="capitalize">{c.toLowerCase()}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Priority</Label>
                                <Select onValueChange={v => setForm({ ...form, priority: v })} defaultValue={form.priority}>
                                    <SelectTrigger className="bg-muted/30 capitalize">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorities.map(p => (
                                            <SelectItem key={p} value={p} className="capitalize">{p.toLowerCase()}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                            <Textarea
                                placeholder="Tell us more so we can help faster..."
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="bg-muted/30 min-h-[100px] resize-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Evidence / Photos</Label>
                            <div className="flex flex-wrap gap-3">
                                <label className="h-20 w-20 border-2 border-dashed border-muted rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary group">
                                    <Upload className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-medium">Add</span>
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        accept="image/*"
                                        onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files || [])])}
                                    />
                                </label>

                                {files.map((f, i) => (
                                    <div key={i} className="h-20 w-20 bg-muted/50 rounded-xl relative flex items-center justify-center border group overflow-hidden">
                                        <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                                                className="bg-destructive text-destructive-foreground p-1 rounded-full shadow-lg"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                                            <p className="text-[8px] text-white truncate text-center px-1">{f.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="p-6 pt-2 bg-muted/10">
                    <Button
                        onClick={submit}
                        disabled={loading}
                        className="w-full h-12 font-bold text-lg shadow-lg"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Submitting...</>
                        ) : (
                            "Submit Ticket"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}