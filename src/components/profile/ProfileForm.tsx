import { useEffect, useState } from "react";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Pencil, Save } from "lucide-react";

const ProfileForm = () => {
    const { tenant, fetchMe } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
    });

    useEffect(() => {
        if (tenant) {
            setForm({
                fullName: tenant.fullName || "",
                email: tenant.email || "",
                phone: tenant.phone || "",
                dateOfBirth: tenant.dateOfBirth ? new Date(tenant.dateOfBirth).toISOString().split('T')[0] : "",
                gender: tenant.gender || "",
            });
        }
    }, [tenant]);

    const submit = async () => {
        setLoading(true);
        try {
            await apiPrivate.patch("/tenant/me", form);
            toast.success("Profile updated successfully");
            await fetchMe();
            setEditing(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const DisplayField = ({ label, value }: { label: string; value: string | undefined }) => (
        <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase">{label}</p>
            <p className="text-sm font-medium">{value || "Not provided"}</p>
        </div>
    );

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                {!editing ? (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-2">
                        <Pencil className="h-4 w-4" /> Edit
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={submit} disabled={loading} className="gap-2">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editing ? (
                    <>
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Date of Birth</Label>
                            <Input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select value={form.gender} onValueChange={val => setForm({ ...form, gender: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                ) : (
                    <>
                        <DisplayField label="Full Name" value={tenant?.fullName} />
                        <DisplayField label="Email Address" value={tenant?.email!} />
                        <DisplayField label="Phone Number" value={tenant?.phone!} />
                        <DisplayField label="Date of Birth" value={tenant?.dateOfBirth ? new Date(tenant.dateOfBirth).toLocaleDateString() : ""} />
                        <DisplayField label="Gender" value={tenant?.gender!} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileForm;