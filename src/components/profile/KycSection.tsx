import { useState } from "react";
import KycModal from "./KycModal";
import KycCard from "./KycCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import type { Kyc } from "@/types/tenant";

const KycSection = () => {
    const [open, setOpen] = useState(false);
    const { tenant, refreshTenant } = useAuth();

    const kycs = tenant?.kycs ?? [];

    const refresh = async () => {
        await refreshTenant();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <h2 className="text-lg font-semibold">
                    KYC Documents
                </h2>

                <Button size="sm" onClick={() => setOpen(true)}>
                    Add KYC
                </Button>
            </div>

            {kycs.length === 0 ? (
                <p className="text-muted-foreground">
                    No KYC documents added.
                </p>
            ) : (
                <div className="grid md:grid-cols-3 gap-4">
                    {kycs.map((k: Kyc) => (
                        <KycCard
                            key={k.id}
                            kyc={k}
                            onUpdated={refresh}
                        />
                    ))}
                </div>
            )}

            <KycModal
                open={open}
                onClose={() => setOpen(false)}
                onSuccess={refresh}
            />
        </div>
    );
};

export default KycSection;