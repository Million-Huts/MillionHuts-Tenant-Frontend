import { FileText, Trash2, Pencil, ShieldCheck, AlertCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteKyc } from "@/api/tenant";
import toast from "react-hot-toast";
import { useState } from "react";
import KycModal from "./KycModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import type { Kyc } from "@/types/tenant";
import { cn } from "@/lib/utils";

interface Props {
    kyc: Kyc;
    onUpdated?: () => void;
}

const statusConfig: Record<Kyc["status"], { color: string; icon: any }> = {
    PENDING: { color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock },
    SUBMITTED: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: FileText },
    VERIFIED: { color: "bg-green-500/10 text-green-600 border-green-500/20", icon: ShieldCheck },
    REJECTED: { color: "bg-red-500/10 text-red-600 border-red-500/20", icon: AlertCircle },
};

const KycCard = ({ kyc, onUpdated }: Props) => {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const config = statusConfig[kyc.status];

    const handleDelete = async () => {
        try {
            await deleteKyc(kyc.id);
            toast.success("KYC removed");
            onUpdated?.();
        } catch {
            toast.error("Failed to remove KYC");
        }
    };

    return (
        <>
            <Card className="relative overflow-hidden group border-muted/60 transition-all hover:shadow-md">
                <div className={cn("absolute top-0 left-0 w-1 h-full", config.color.split(' ')[1].replace('text', 'bg'))} />

                <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg", config.color)}>
                                <config.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-none">{kyc.documentType}</h3>
                                <p className="text-[11px] text-muted-foreground mt-1 font-mono uppercase tracking-tighter">
                                    #{kyc.documentNo || 'NO-ID'}
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0", config.color)}>
                            {kyc.status}
                        </Badge>
                    </div>

                    {kyc.status === "REJECTED" && (
                        <div className="mb-4 p-2 bg-red-50 rounded text-[11px] text-red-600 border border-red-100 italic">
                            Reason: {kyc.rejectionReason}
                        </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-muted/50">
                        <Button variant="ghost" size="sm" className="h-8 flex-1 text-xs" onClick={() => setEditOpen(true)}>
                            <Pencil className="w-3 h-3 mr-2" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 flex-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/5" onClick={() => setDeleteOpen(true)}>
                            <Trash2 className="w-3 h-3 mr-2" /> Remove
                        </Button>
                    </div>
                </div>
            </Card>

            <KycModal open={editOpen} onClose={() => setEditOpen(false)} existingKyc={kyc} onSuccess={onUpdated} />
            <DeleteConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Remove Document" description="This KYC document will be permanently deleted from our servers." />
        </>
    );
};

export default KycCard;