import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud } from "lucide-react";
import { createKyc, updateKyc } from "@/api/tenant";
import toast from "react-hot-toast";
import type { Kyc } from "@/types/tenant";

interface Props {
    open: boolean;
    onClose: () => void;
    existingKyc?: Kyc | null;
    onSuccess?: () => void;
}

const DOC_TYPES = [
    { label: "Aadhar Card", value: "AADHAR" },
    { label: "PAN Card", value: "PAN" },
    { label: "Passport", value: "PASSPORT" },
    { label: "Driving License", value: "DRIVING_LICENSE" },
];

const KycModal = ({ open, onClose, existingKyc, onSuccess }: Props) => {
    const [loading, setLoading] = useState(false);
    const [docType, setDocType] = useState("");
    const [docNo, setDocNo] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const isEdit = !!existingKyc;

    useEffect(() => {
        if (open) {
            setDocType(existingKyc?.documentType || "");
            setDocNo(existingKyc?.documentNo || "");
            setFile(null);
        }
    }, [existingKyc, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: In edit mode, file is optional if they don't want to change the image
        if (!docType || (!file && !isEdit)) {
            return toast.error("Please provide document type and file");
        }

        setLoading(true);
        const fd = new FormData();
        fd.append("documentType", docType);
        fd.append("documentNo", docNo);
        if (file) fd.append("documentFile", file);

        try {
            if (isEdit && existingKyc) {
                await updateKyc(existingKyc.id, fd);
                toast.success("Verification document updated");
            } else {
                await createKyc(fd);
                toast.success("Verification document submitted");
            }

            onSuccess?.();
            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Update Document" : "Verify Identity"}</DialogTitle>
                    <DialogDescription>
                        Upload a valid government ID to verify your account.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="docType">Document Type</Label>
                        <select
                            id="docType"
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select a document type</option>
                            {DOC_TYPES.map((d) => (
                                <option key={d.value} value={d.value}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="docNo">Document Number (Optional)</Label>
                        <Input
                            id="docNo"
                            placeholder="e.g. 1234-5678-9012"
                            value={docNo}
                            onChange={(e) => setDocNo(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Upload Image</Label>
                        <div className="group relative mt-1 flex justify-center rounded-lg border border-dashed border-muted-foreground/25 px-6 py-10 transition-colors hover:border-primary/50">
                            <div className="text-center">
                                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                                    <label className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80">
                                        <span>{file ? "Change file" : "Upload a file"}</span>
                                        <input
                                            type="file"
                                            className="sr-only"
                                            accept="image/*,.pdf"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-muted-foreground">
                                    {file ? file.name : "PNG, JPG up to 5MB"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="min-w-[100px]">
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                isEdit ? "Update" : "Submit"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default KycModal;