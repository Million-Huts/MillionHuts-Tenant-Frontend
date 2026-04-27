import { motion } from "framer-motion";
import { User, ShieldCheck } from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import KycSection from "@/components/profile/KycSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TenantProfile = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-8 px-4 space-y-8"
    >
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and verification documents.</p>
      </header>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="kyc" className="gap-2">
            <ShieldCheck className="h-4 w-4" /> Verification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 outline-none">
          <ProfileCard />
        </TabsContent>

        <TabsContent value="kyc" className="space-y-6 outline-none">
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <KycSection />
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TenantProfile;