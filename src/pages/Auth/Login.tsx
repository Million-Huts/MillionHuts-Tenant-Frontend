import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    // =============================
    // IDENTIFY
    // =============================
    const handleIdentify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier.trim()) return;

        setLoading(true);
        try {
            const res = await api.post("/auth/login/identify", {
                identifier: identifier.trim(),
            });

            const { nextStep, tenantId, tenant } = res.data;

            setTenantData({ ...tenant, id: tenantId });

            if (nextStep === "PASSWORD_SETUP_VERIFY") {
                setStep("SET_PASSWORD_OTP");
            } else if (nextStep === "VERIFY_EMAIL") {
                setStep("EMAIL_VERIFY");
            } else {
                setStep("PASSWORD");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Tenant not found");
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // PASSWORD LOGIN
    // =============================
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;

        setLoading(true);
        try {
            await api.post("/auth/login/password", {
                tenantId: tenantData?.id,
                password,
            });

            toast.success("Welcome back!");
            await fetchMe();
            navigate("/dashboard");
        } catch {
            toast.error("Incorrect password");
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // SEND EMAIL VERIFICATION OTP
    // =============================
    const handleSendVerification = async () => {
        setLoading(true);
        try {
            await api.post("/auth/send-verification", {
                tenantId: tenantData?.id,
            });

            toast.success("Verification code sent");
        } catch {
            toast.error("Failed to send code");
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // VERIFY EMAIL OTP
    // =============================
    const handleVerifyEmail = async () => {
        if (otp.length < 6) return;

        setLoading(true);
        try {
            await api.post("/auth/verify-otp", {
                tenantId: tenantData?.id,
                otp,
                process: "EMAIL_VERIFICATION",
            });

            setOtp("");
            setStep("PASSWORD");
            toast.success("Email verified. Continue login.");
        } catch {
            toast.error("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // VERIFY FOR PASSWORD SETUP
    // =============================
    const handleVerifyForSetup = async () => {
        if (otp.length < 6) return;

        setLoading(true);
        try {
            await api.post("/auth/verify-otp", {
                tenantId: tenantData?.id,
                otp,
                process: "PASSWORD_CREATION",
            });

            setOtp("");
            setStep("SET_PASSWORD_FORM");
            toast.success("Verified! Set your password.");
        } catch {
            toast.error("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // CREATE PASSWORD
    // =============================
    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            await api.post("/auth/create-password", {
                tenantId: tenantData?.id,
                password,
            });

            toast.success("Account ready!");
            await fetchMe();
            navigate("/dashboard");
        } catch {
            toast.error("Failed to set password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-6">

                <h1 className="text-3xl font-bold text-center">Login</h1>

                <AnimatePresence mode="wait">

                    {/* IDENTIFY */}
                    {step === "IDENTIFY" && (
                        <motion.form
                            key="identify"
                            onSubmit={handleIdentify}
                            className="space-y-4"
                        >
                            <Input
                                placeholder="Email or Phone"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />

                            <Button className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : "Continue"}
                            </Button>
                        </motion.form>
                    )}

                    {/* AFTER IDENTIFY */}
                    {step !== "IDENTIFY" && tenantData && (
                        <motion.div key="steps" className="space-y-4">

                            <div className="p-3 rounded-xl bg-muted">
                                <p className="font-semibold">{tenantData.fullName}</p>
                                <p className="text-xs text-muted-foreground">
                                    {tenantData.email || tenantData.phone}
                                </p>
                            </div>

                            {/* PASSWORD */}
                            {step === "PASSWORD" && (
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    <Button className="w-full" disabled={loading}>
                                        {loading ? "Loading..." : "Login"}
                                    </Button>
                                </form>
                            )}

                            {/* EMAIL VERIFY */}
                            {step === "EMAIL_VERIFY" && (
                                <div className="space-y-4">
                                    <p className="text-sm">Verify your email to continue</p>

                                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                        <InputOTPGroup>
                                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                                <InputOTPSlot key={i} index={i} />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>

                                    <Button onClick={handleVerifyEmail} disabled={loading}>
                                        Verify
                                    </Button>

                                    <Button variant="outline" onClick={handleSendVerification}>
                                        Resend Code
                                    </Button>
                                </div>
                            )}

                            {/* PASSWORD SETUP OTP */}
                            {step === "SET_PASSWORD_OTP" && (
                                <div className="space-y-4">
                                    <p className="text-sm">Verify to set password</p>

                                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                        <InputOTPGroup>
                                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                                <InputOTPSlot key={i} index={i} />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>

                                    <Button onClick={handleVerifyForSetup} disabled={loading}>
                                        Verify
                                    </Button>
                                </div>
                            )}

                            {/* SET PASSWORD */}
                            {step === "SET_PASSWORD_FORM" && (
                                <form onSubmit={handleSetPassword} className="space-y-4">
                                    <Input
                                        type="password"
                                        placeholder="New Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    <Input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />

                                    <Button className="w-full" disabled={loading}>
                                        Set Password
                                    </Button>
                                </form>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>

                <p className="text-center text-sm">
                    New user? <Link to="/register">Register</Link>
                </p>
                <p className="text-center text-sm">
                    <Link to="/forgot-password">forgot password? </Link>
                </p>
            </div>
        </div>
    );
}
