import { useRef, useState } from "react";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Camera, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ProfileImage = () => {
    const { tenant, fetchMe } = useAuth();
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const onUpload = async (file: File) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Only image files are allowed");
        if (file.size > MAX_FILE_SIZE) return toast.error("Image must be less than 2MB");

        const formData = new FormData();
        formData.append("profileImage", file);

        setUploading(true);
        try {
            await apiPrivate.patch("/tenant/me/profile-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Profile image updated");
            await fetchMe();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = async () => {
        setUploading(true);
        try {
            await apiPrivate.delete("/tenant/me/profile-image");
            toast.success("Profile image removed");
            await fetchMe();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to remove image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-6 bg-muted/20 rounded-2xl border border-dashed border-muted-foreground/20">
            <div className="relative">
                {/* Image Container */}
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-background shadow-xl ring-1 ring-muted">
                    <img
                        src={tenant?.profileImage || "/avatar.png"}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                        alt="Profile"
                    />

                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                    )}
                </div>

                {/* Remove Image Button (Conditional) */}
                {tenant?.profileImage && !uploading && (
                    <button
                        onClick={removeImage}
                        title="Remove image"
                        className="absolute top-1 right-1 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-md hover:scale-110 transition-transform border-2 border-background"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}

                {/* Upload Action Button */}
                <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-1 right-3 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110 border-2 border-background disabled:opacity-50"
                >
                    <Camera className="h-4 w-4" />
                </button>
            </div>

            <div className="text-center space-y-1.5">
                <h3 className="font-bold text-xl tracking-tight">
                    {tenant?.fullName || "User Account"}
                </h3>
                <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                        Tenant
                    </Badge>
                </div>
            </div>

            <input
                type="file"
                hidden
                ref={fileRef}
                accept="image/*"
                onChange={(e) => e.target.files && onUpload(e.target.files[0])}
            />
        </div>
    );
};

export default ProfileImage;