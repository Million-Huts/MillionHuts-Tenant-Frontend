import { useEffect, useState } from "react";
import { updateProfile } from "@/api/tenant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Pencil, Save, X } from "lucide-react";

const ProfileForm = () => {
    const { tenant, refreshTenant } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
    });

    useEffect(() => {
        if (tenant) {
            setForm({
                fullName: tenant.fullName || "",
                phone: tenant.phone || "",
            });
        }
    }, [tenant]);

    const submit = async () => {
        setLoading(true);
        try {
            await updateProfile(form);
            toast.success("Profile updated");
            await refreshTenant();
            setEditing(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update");
        } finally {
            setLoading(false);
        }
    };

    const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => (
        <div className="py-3 border-b border-muted/50 last:border-0">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
            <p className="text-sm font-medium">{value || "—"}</p>
        </div>
    );

    return (
        <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold tracking-tight">Personal Details</h2>
                {!editing ? (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-2">
                        <Pencil className="h-4 w-4" /> Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={loading}>
                            <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button size="sm" onClick={submit} disabled={loading} className="gap-2 shadow-md shadow-primary/20">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>

            <div className={editing ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-x-8"}>
                {!editing ? (
                    <>
                        <InfoRow label="Full Name" value={tenant?.fullName} />
                        <InfoRow label="Email Address" value={tenant?.email} />
                        <InfoRow label="Phone Number" value={tenant?.phone} />
                        <InfoRow label="Member Since" value={tenant?.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'} />
                    </>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileForm;