import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { Chrome, UserPlus, Mail, Phone, Lock, User, ArrowRight } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullName = form.fullName.trim();
        const email = form.email.trim();
        const phone = form.phone.trim();

        if (!fullName || !form.password) return toast.error("Please fill required fields");
        if (!email && !phone) return toast.error("Email or phone required");
        if (form.password.length < 6) return toast.error("Password too short");

        try {
            setLoading(true);
            await api.post("/auth/register", {
                ...form,
                fullName,
                email: email || undefined,
                phone: phone || undefined,
            });
            toast.success("Welcome to MillionHuts!");
            navigate("/login");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden px-4">
            {/* Ambient background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-[400px] z-10 space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent p-[1px] mb-2 shadow-soft">
                        <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                            <UserPlus className="text-primary w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gradient">
                        Create Account
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">
                        Start your premium living experience today.
                    </p>
                </div>

                {/* Form Card */}
                <Card className="border-border/40 shadow-soft glass overflow-hidden">
                    <CardContent className="pt-8 pb-8 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-4">
                                {/* Name Input */}
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        name="fullName"
                                        placeholder="Full Name"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        className="pl-10 bg-background/40 border-muted focus:border-primary/50 h-12 rounded-xl transition-all"
                                    />
                                </div>

                                {/* Multi-entry logic for Contact */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="Email Address"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="pl-10 bg-background/40 border-muted focus:border-primary/50 h-12 rounded-xl transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            name="phone"
                                            placeholder="Phone Number"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="pl-10 bg-background/40 border-muted focus:border-primary/50 h-12 rounded-xl transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="Create Password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="pl-10 bg-background/40 border-muted focus:border-primary/50 h-12 rounded-xl transition-all"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 font-bold text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Setting up...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Get Started <ArrowRight size={18} />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-muted/60"></div>
                            <span className="flex-shrink mx-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">or</span>
                            <div className="flex-grow border-t border-muted/60"></div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-12 flex gap-3 border-muted bg-background/20 hover:bg-background/60 text-foreground font-medium rounded-xl transition-all"
                            disabled
                        >
                            <Chrome className="w-5 h-5 text-accent" />
                            Continue with Google
                        </Button>
                        {/* Footer Link */}
                        <p className="text-center text-sm text-muted-foreground font-medium">
                            Joined us before?{" "}
                            <Link to="/login" className="text-primary hover:text-accent font-bold transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;