// pages/Profile/TenantProfilePage.tsx
import ProfileCard from "@/components/profile/ProfileCard";
import KycSection from "@/components/profile/KycSection";

const TenantProfilePage = () => {
  return (
    <div className="space-y-6">
      <ProfileCard />
      <KycSection />
    </div>
  );
};

export default TenantProfilePage;
