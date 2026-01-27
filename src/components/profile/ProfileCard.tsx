// components/profile/ProfileCard.tsx
import ProfileImage from "./ProfileImage";
import ProfileForm from "./ProfileForm";
import { Card } from "@/components/ui/card";

const ProfileCard = () => {
    return (
        <Card className="p-6 flex flex-col md:flex-row gap-6 md:items-center">
            <ProfileImage />
            <ProfileForm />
        </Card>
    );
};

export default ProfileCard;
