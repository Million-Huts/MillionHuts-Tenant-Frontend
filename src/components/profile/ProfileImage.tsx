import { useRef, useState } from "react";
import { apiPrivate } from "@/lib/api";

import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

import { Camera, Loader2, Trash2 } from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ProfileImage = () => {
    const { tenant, fetchMe } = useAuth();

    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    // =============================
    // Upload Image
    // =============================
    const onUpload = async (file: File) => {
        if (!file) return;

        // Validate type
        if (!file.type.startsWith("image/")) {
            return toast.error("Only image files are allowed");
        }

        // Validate size
        if (file.size > MAX_FILE_SIZE) {
            return toast.error("Image must be less than 2MB");
        }

        const formData = new FormData();
        formData.append("profileImage", file);

        setUploading(true);
        try {
            await apiPrivate.patch("/tenant/me/profile-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Profile image updated");
            await fetchMe();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Upload failed"
            );
        } finally {
            setUploading(false);
        }
    };

    // =============================
    // Remove Image
    // =============================
    const removeImage = async () => {
        setUploading(true);
        try {
            await apiPrivate.delete("/tenant/me/profile-image");

            toast.success("Profile image removed");
            await fetchMe();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to remove image"
            );
        } finally {
            setUploading(false);
        }
    };

    // =============================
    // UI
    // =============================
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl overflow-hidden border shadow-xl">
                    <img
                        src={
                            tenant?.profileImage ||
                            "/avatar.png"
                        }
                        className="h-full w-full object-cover"
                        alt="Profile"
                    />

                    {uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg"
                >
                    <Camera className="h-4 w-4" />
                </button>

                {/* Remove Button */}
                {tenant?.profileImage && (
                    <button
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-2 bg-destructive text-white rounded-lg shadow-lg"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>

            <input
                type="file"
                hidden
                ref={fileRef}
                accept="image/*"
                onChange={(e) =>
                    e.target.files &&
                    onUpload(e.target.files[0])
                }
            />

            <div className="text-center">
                <h3 className="font-bold text-xl">
                    {tenant?.fullName}
                </h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Tenant Account
                </p>
            </div>
        </div>
    );
};

export default ProfileImage;