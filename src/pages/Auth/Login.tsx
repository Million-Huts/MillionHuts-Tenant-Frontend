import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type AuthStep =
    | "IDENTIFY"
    | "PASSWORD"
    | "EMAIL_VERIFY"
    | "SET_PASSWORD_OTP"
    | "SET_PASSWORD_FORM";

interface TenantData {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
}

export default function LoginPage() {
    const { fetchMe } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState<AuthStep>("IDENTIFY");
    const [loading, setLoading] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [tenantData, setTenantData] = useState<TenantData | null>(null);
    const [otp, setOtp] = useState("");

    // Animation Variants
    const slideVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    // =============================
    // LOGIC HANDLERS
    // =============================
    const handleIdentify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier.trim()) return;
        setLoading(true);
        try {
            const res = await api.post("/auth/login/identify", { identifier: identifier.trim() });
            const { nextStep, tenantId, tenant } = res.data;
            setTenantData({ ...tenant, id: tenantId });

            if (nextStep === "PASSWORD_SETUP_VERIFY") setStep("SET_PASSWORD_OTP");
            else if (nextStep === "VERIFY_EMAIL") setStep("EMAIL_VERIFY");
            else setStep("PASSWORD");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Account not found");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/auth/login/password", { tenantId: tenantData?.id, password });
            toast.success(`Welcome back, ${tenantData?.fullName.split(' ')[0]}!`);
            await fetchMe();
            navigate("/dashboard");
        } catch {
            toast.error("Invalid password");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        setLoading(true);
        try {
            await api.post("/auth/verify-otp", { tenantId: tenantData?.id, otp, process: "EMAIL_VERIFICATION" });
            setOtp("");
            setStep("PASSWORD");
            toast.success("Identity verified");
        } catch {
            toast.error("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return toast.error("Passwords match required");
        setLoading(true);
        try {
            await api.post("/auth/create-password", { tenantId: tenantData?.id, password });
            toast.success("Account set up successfully!");
            await fetchMe();
            navigate("/dashboard");
        } catch {
            toast.error("Setup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
            {/* Nordic Ambient Background */}
            <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="w-full max-w-[400px] z-10 space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gradient">Welcome back</h1>
                    <p className="text-muted-foreground text-sm font-medium">Log in to manage your MillionHuts stay.</p>
                </div>

                <Card className="glass border-border/40 shadow-soft overflow-hidden">
                    <CardContent className="pt-8 pb-8">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: IDENTIFY */}
                            {step === "IDENTIFY" && (
                                <motion.form key="id" {...slideVariants} onSubmit={handleIdentify} className="space-y-6">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            placeholder="Email or Phone Number"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            className="pl-10 h-12 bg-background/50 rounded-xl border-muted focus:border-primary"
                                        />
                                    </div>
                                    <Button className="w-full h-12 bg-primary font-bold shadow-lg shadow-primary/20 rounded-xl" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin" /> : "Continue"}
                                    </Button>
                                </motion.form>
                            )}

                            {/* STEPS 2-5: REQUIRES TENANT PROFILE */}
                            {step !== "IDENTIFY" && tenantData && (
                                <motion.div key="context" {...slideVariants} className="space-y-6">
                                    {/* User Context Card */}
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 border border-border/20">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                                            {tenantData.fullName[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{tenantData.fullName}</p>
                                            <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-bold">
                                                {tenantData.email || tenantData.phone}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => setStep("IDENTIFY")} className="h-8 w-8 rounded-full">
                                            <ArrowLeft size={14} />
                                        </Button>
                                    </div>

                                    {/* PASSWORD LOGIN */}
                                    {step === "PASSWORD" && (
                                        <form onSubmit={handleLogin} className="space-y-4">
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    type="password"
                                                    autoFocus
                                                    placeholder="Enter Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="pl-10 h-12 bg-background/50 rounded-xl border-muted focus:border-primary"
                                                />
                                            </div>
                                            <Button className="w-full h-12 bg-primary font-bold rounded-xl" disabled={loading}>
                                                {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                                            </Button>
                                            <Link to="/forgot-password" className="block text-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                                                Forgot your password?
                                            </Link>
                                        </form>
                                    )}

                                    {/* OTP VERIFICATION (Used for both Email and Password Setup) */}
                                    {(step === "EMAIL_VERIFY" || step === "SET_PASSWORD_OTP") && (
                                        <div className="space-y-6 flex flex-col items-center">
                                            <div className="text-center space-y-1">
                                                <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-2" />
                                                <p className="text-sm font-bold italic text-accent">Security Verification</p>
                                                <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to you.</p>
                                            </div>

                                            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                                <InputOTPGroup className="gap-2">
                                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                                        <InputOTPSlot key={i} index={i} className="h-12 w-11 rounded-lg bg-background/60 border-muted" />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>

                                            <Button
                                                onClick={step === "EMAIL_VERIFY" ? handleVerifyEmail : () => setStep("SET_PASSWORD_FORM")}
                                                disabled={otp.length < 6 || loading}
                                                className="w-full h-12 bg-accent font-bold rounded-xl"
                                            >
                                                {loading ? <Loader2 className="animate-spin" /> : "Verify Identity"}
                                            </Button>
                                        </div>
                                    )}

                                    {/* FIRST TIME PASSWORD SETUP */}
                                    {step === "SET_PASSWORD_FORM" && (
                                        <form onSubmit={handleSetPassword} className="space-y-4">
                                            <p className="text-xs font-bold text-center text-primary uppercase tracking-widest italic">Secure Your Account</p>
                                            <div className="relative">
                                                <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    type="password"
                                                    placeholder="Create Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="pl-10 h-12 bg-background/50 rounded-xl border-muted"
                                                />
                                            </div>
                                            <Input
                                                type="password"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="h-12 bg-background/50 rounded-xl border-muted"
                                            />
                                            <Button className="w-full h-12 bg-accent font-bold rounded-xl shadow-lg shadow-accent/20" disabled={loading}>
                                                {loading ? <Loader2 className="animate-spin" /> : "Complete Setup"}
                                            </Button>
                                        </form>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {/* Footer Links */}
                <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground font-medium">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary font-bold hover:underline">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}