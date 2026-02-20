import { useRef, useState } from "react";
import { uploadProfileImage } from "@/api/tenant";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Camera, Loader2 } from "lucide-react";

const ProfileImage = () => {
    const { tenant, refreshTenant } = useAuth();
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const onUpload = async (file: File) => {
        setUploading(true);
        try {
            await uploadProfileImage(file);
            toast.success("Profile image updated");
            await refreshTenant();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl overflow-hidden border-4 border-background shadow-xl ring-1 ring-muted">
                    <img
                        src={tenant?.profileImage || "/avatar.png"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt="Profile"
                    />
                    {uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                    )}
                </div>
                <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg hover:scale-105 transition-transform"
                >
                    <Camera className="h-4 w-4" />
                </button>
            </div>

            <input
                type="file"
                hidden
                ref={fileRef}
                accept="image/*"
                onChange={(e) => e.target.files && onUpload(e.target.files[0])}
            />

            <div className="text-center">
                <h3 className="font-bold text-xl">{tenant?.fullName}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tenant Account</p>
            </div>
        </div>
    );
};

export default ProfileImage;