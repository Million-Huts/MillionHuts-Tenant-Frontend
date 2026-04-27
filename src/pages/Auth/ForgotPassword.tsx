import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from "@/components/ui/input-otp";

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
    // STEP 1: REQUEST OTP
    // =============================
    const handleIdentify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!identifier.trim()) {
            return toast.error("Enter email or phone");
        }

        setLoading(true);
        try {
            await api.post("/auth/password/forgot", {
                identifier: identifier.trim(),
            });

            setStep("VERIFY");
            toast.success("If account exists, OTP sent");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // STEP 2: VERIFY OTP
    // =============================
    const handleVerifyOTP = async () => {
        if (otp.length < 6) return;

        setLoading(true);
        try {
            await api.post("/auth/password/forgot/verify", {
                identifier: identifier.trim(),
                otp,
            });

            setStep("RESET");
            toast.success("OTP verified");
        } catch {
            toast.error("Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // STEP 3: RESET PASSWORD
    // =============================
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            await api.post("/auth/password/forgot/reset", {
                identifier: identifier.trim(),
                newPassword: password,
            });

            toast.success("Password reset successfully!");
            navigate("/login");
        } catch {
            toast.error("Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-6">

                <Link to="/login" className="text-sm flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                <h2 className="text-2xl font-bold">Reset Password</h2>

                <AnimatePresence mode="wait">

                    {/* STEP 1 */}
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
                                {loading ? <Loader2 className="animate-spin" /> : "Send Code"}
                            </Button>
                        </motion.form>
                    )}

                    {/* STEP 2 */}
                    {step === "VERIFY" && (
                        <motion.div
                            key="verify"
                            className="space-y-4 flex flex-col items-center"
                        >
                            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                <InputOTPGroup>
                                    {[0, 1, 2, 3, 4, 5].map(i => (
                                        <InputOTPSlot key={i} index={i} />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>

                            <Button
                                onClick={handleVerifyOTP}
                                disabled={otp.length < 6 || loading}
                                className="w-full"
                            >
                                Verify Code
                            </Button>

                            <button
                                onClick={() => handleIdentify(new Event("submit") as any)}
                                className="text-xs underline"
                            >
                                Resend Code
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3 */}
                    {step === "RESET" && (
                        <motion.form
                            key="reset"
                            onSubmit={handleResetPassword}
                            className="space-y-4"
                        >
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

                            <div className="text-xs space-y-1">
                                <div className={password.length >= 6 ? "text-green-600" : ""}>
                                    Min 6 characters
                                </div>
                                <div className={password === confirmPassword ? "text-green-600" : ""}>
                                    Passwords match
                                </div>
                            </div>

                            <Button
                                className="w-full"
                                disabled={
                                    loading ||
                                    password.length < 6 ||
                                    password !== confirmPassword
                                }
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
                            </Button>
                        </motion.form>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}