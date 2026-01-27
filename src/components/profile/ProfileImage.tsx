// components/profile/ProfileImage.tsx
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { uploadProfileImage } from "@/api/tenant";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const ProfileImage = () => {
    const { tenant, refreshTenant } = useAuth();
    const fileRef = useRef<HTMLInputElement>(null);

    const onUpload = async (file: File) => {
        try {
            await uploadProfileImage(file);
            toast.success("Profile image updated");
            refreshTenant();
        } catch {
            toast.error("Failed to update image");
        }
    };

    return (
        <div className=" flex flex-col items-center gap-3">
            <img
                src={tenant?.profileImage || "/avatar.png"}
                className="h-28 w-28 md:h-42 md:w-42 rounded-full object-cover border"
            />
            <input
                type="file"
                hidden
                ref={fileRef}
                onChange={(e) => e.target.files && onUpload(e.target.files[0])}
            />
            <Button size="sm" onClick={() => fileRef.current?.click()}>
                Change
            </Button>
        </div>
    );
};

export default ProfileImage;
