// components/profile/KycCard.tsx
import { FileText, Trash2, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteKyc } from "@/api/tenant";
import toast from "react-hot-toast";
import { useState } from "react";
import KycModal from "./KycModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import type { Kyc } from "@/types/tenant";

interface Props {
    kyc: Kyc;
    onUpdated?: () => void;
}

const statusColor: Record<Kyc["status"], string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    SUBMITTED: "bg-blue-100 text-blue-700",
    VERIFIED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
};

const KycCard = ({ kyc, onUpdated }: Props) => {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteKyc(kyc.id);
            toast.success("KYC removed");
            onUpdated?.();
        } catch {
            toast.error("Failed to remove KYC");
        } finally {
            setDeleteOpen(false);
        }
    };

    return (
        <>
            <Card className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-medium">{kyc.documentType}</h3>
                    </div>
                    <Badge className={statusColor[kyc.status]}>
                        {kyc.status}
                    </Badge>
                </div>

                {/* Document info */}
                {kyc.documentNo && (
                    <p className="text-sm text-muted-foreground">
                        Doc No: {kyc.documentNo}
                    </p>
                )}

                {/* Rejection reason */}
                {kyc.status === "REJECTED" && kyc.rejectionReason && (
                    <p className="text-sm text-red-600">
                        {kyc.rejectionReason}
                    </p>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditOpen(true)}
                    >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                    </Button>

                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                    </Button>
                </div>
            </Card>

            {/* Edit modal */}
            <KycModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                existingKyc={kyc}
                onSuccess={onUpdated}
            />

            {/* Delete confirm */}
            <DeleteConfirmDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Remove KYC document?"
                description="This action cannot be undone. You will need to re-upload the document."
            />
        </>
    );
};

export default KycCard;
