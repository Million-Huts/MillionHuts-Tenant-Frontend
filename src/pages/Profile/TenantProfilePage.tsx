import { motion } from "framer-motion";
import ProfileCard from "@/components/profile/ProfileCard";
import KycSection from "@/components/profile/KycSection";
import { ShieldCheck, UserCircle } from "lucide-react";

const TenantProfilePage = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto space-y-8 pb-10"
    >
      {/* Profile Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <UserCircle className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Account Settings</h2>
        </div>
        <ProfileCard />
      </section>

      {/* KYC Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Identity Verification</h2>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <KycSection />
        </div>
      </section>
    </motion.div>
  );
};

export default TenantProfilePage;