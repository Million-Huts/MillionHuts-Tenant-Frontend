// components/profile/ProfileForm.tsx
import { useState } from "react";
import { updateProfile } from "@/api/tenant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const ProfileForm = () => {
    const { tenant, refreshTenant } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        fullName: tenant?.fullName || "",
        phone: tenant?.phone || "",
        dateOfBirth: tenant?.dateOfBirth || "",
        gender: tenant?.gender || "",
    });

    const submit = async () => {
        try {
            await updateProfile(form);
            toast.success("Profile updated");
            refreshTenant();
            setEditing(false);
        } catch {
            toast.error("Failed to update");
        }
    };

    return (
        <div className="flex-1 space-y-3">
            {!editing ? (
                <>
                    <p><b>Name:</b> {tenant?.fullName}</p>
                    <p><b>Email:</b> {tenant?.email}</p>
                    <p><b>Phone:</b> {tenant?.phone}</p>
                    <Button size="sm" onClick={() => setEditing(true)}>Edit</Button>
                </>
            ) : (
                <>
                    <Input
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="Full Name"
                    />
                    <Input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Phone"
                    />
                    <Button size="sm" onClick={submit}>Save</Button>
                </>
            )}
        </div>
    );
};

export default ProfileForm;
