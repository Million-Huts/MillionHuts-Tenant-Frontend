import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, Lock, ShieldCheck, KeyRound, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from "@/components/ui/input-otp";
import { Card, CardContent } from "@/components/ui/card";

import { api } from "@/lib/api";

type Step = "IDENTIFY" | "VERIFY" | "RESET";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>("IDENTIFY");
    const [loading, setLoading] = useState(false);

    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    // =============================
    // HANDLERS (LOGIC UNCHANGED)
    // =============================
    const handleIdentify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier.trim()) return toast.error("Enter email or phone");

        setLoading(true);
        try {
            await api.post("/auth/password/forgot", { identifier: identifier.trim() });
            setStep("VERIFY");
            toast.success("Security code sent");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length < 6) return;
        setLoading(true);
        try {
            await api.post("/auth/password/forgot/verify", { identifier: identifier.trim(), otp });
            setStep("RESET");
            toast.success("Identity verified");
        } catch {
            toast.error("Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) return toast.error("Password too short");
        if (password !== confirmPassword) return toast.error("Passwords do not match");

        setLoading(true);
        try {
            await api.post("/auth/password/forgot/reset", {
                identifier: identifier.trim(),
                newPassword: password,
            });
            toast.success("Account secured!");
            navigate("/login");
        } catch {
            toast.error("Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
            {/* Ambient background accents */}
            <div className="absolute top-[-10%] right-[-5%] w-[35%] h-[35%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md z-10 space-y-6">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Return to sign in
                </Link>

                <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gradient">Recovery</h2>
                    <p className="text-muted-foreground text-sm">
                        {step === "IDENTIFY" && "Enter your details to receive a recovery code."}
                        {step === "VERIFY" && "Check your inbox or messages for the 6-digit code."}
                        {step === "RESET" && "Choose a strong password to secure your account."}
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex gap-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 rounded-full ${step === 'IDENTIFY' ? 'w-1/3 bg-primary' : step === 'VERIFY' ? 'w-2/3 bg-primary' : 'w-full bg-accent'}`} />
                </div>

                <Card className="glass border-border/40 shadow-soft overflow-hidden">
                    <CardContent className="pt-8">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: IDENTIFY */}
                            {step === "IDENTIFY" && (
                                <motion.form
                                    key="identify"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleIdentify}
                                    className="space-y-6"
                                >
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            placeholder="Email or Phone"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            className="pl-10 h-12 bg-background/50 rounded-xl"
                                        />
                                    </div>
                                    <Button className="w-full h-12 bg-primary hover:opacity-90 font-bold shadow-lg shadow-primary/20 transition-all rounded-xl" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin" /> : "Send Code"}
                                    </Button>
                                </motion.form>
                            )}

                            {/* STEP 2: VERIFY */}
                            {step === "VERIFY" && (
                                <motion.div
                                    key="verify"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6 flex flex-col items-center"
                                >
                                    <div className="bg-primary/10 p-4 rounded-full">
                                        <ShieldCheck className="w-8 h-8 text-primary" />
                                    </div>
                                    <InputOTP maxLength={6} value={otp} onChange={setOtp} className="gap-2">
                                        <InputOTPGroup className="gap-2">
                                            {[0, 1, 2, 3, 4, 5].map(i => (
                                                <InputOTPSlot key={i} index={i} className="h-12 w-10 sm:w-12 border-muted bg-background/50 rounded-lg focus:ring-primary" />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>

                                    <Button
                                        onClick={handleVerifyOTP}
                                        disabled={otp.length < 6 || loading}
                                        className="w-full h-12 bg-primary font-bold rounded-xl"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Verify Identity"}
                                    </Button>

                                    <button
                                        onClick={() => handleIdentify(new Event("submit") as any)}
                                        className="text-sm font-medium flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                                    >
                                        <RefreshCw size={14} /> Resend security code
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP 3: RESET */}
                            {step === "RESET" && (
                                <motion.form
                                    key="reset"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleResetPassword}
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                placeholder="New Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10 h-12 bg-background/50 rounded-xl"
                                            />
                                        </div>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="pl-10 h-12 bg-background/50 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-3 bg-muted/40 rounded-lg space-y-2">
                                        <div className={`text-xs flex items-center gap-2 font-medium ${password.length >= 6 ? "text-green-500" : "text-muted-foreground"}`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${password.length >= 6 ? "bg-green-500" : "bg-muted-foreground"}`} />
                                            At least 6 characters
                                        </div>
                                        <div className={`text-xs flex items-center gap-2 font-medium ${password && password === confirmPassword ? "text-green-500" : "text-muted-foreground"}`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${password && password === confirmPassword ? "bg-green-500" : "bg-muted-foreground"}`} />
                                            Passwords match
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-12 bg-accent hover:opacity-90 font-bold shadow-lg shadow-accent/20 rounded-xl"
                                        disabled={loading || password.length < 6 || password !== confirmPassword}
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Complete Reset"}
                                    </Button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}