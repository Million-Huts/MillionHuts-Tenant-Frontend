// components/profile/KycModal.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createKyc } from "@/api/tenant";
import toast from "react-hot-toast";
import { useState } from "react";
import { Input } from "../ui/input";

const KycModal = ({ open, onClose }: any) => {
    const [docType, setDocType] = useState("");
    const [docNo, setDocNo] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const submit = async () => {
        if (!file) return toast.error("Upload document");
        const fd = new FormData();
        fd.append("documentType", docType);
        fd.append("documentNo", docNo);
        fd.append("documentFile", file);

        try {
            await createKyc(fd);
            toast.success("KYC submitted");
            onClose();
        } catch {
            toast.error("Failed to submit KYC");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <Input placeholder="Document Type" onChange={(e) => setDocType(e.target.value)} />
                <Input placeholder="Document No" onChange={(e) => setDocNo(e.target.value)} />
                <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <Button onClick={submit}>Submit</Button>
            </DialogContent>
        </Dialog>
    );
};

export default KycModal;
