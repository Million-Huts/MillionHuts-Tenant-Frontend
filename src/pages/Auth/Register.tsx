import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { Chrome, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
    const { login } = useAuth();
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

        if (!form.fullName || !form.password) {
            return toast.error("Please fill required fields");
        }

        if (!form.email && !form.phone) {
            return toast.error("Email or phone required");
        }

        if (form.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            setLoading(true);
            await api.post("/auth/register", {
                ...form,
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
            });

            await login(form.email || form.phone, form.password);
            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Join MillionHuts</h1>
                    <p className="text-muted-foreground text-sm">
                        Create your tenant account to manage your stay.
                    </p>
                </div>

                <Card className="border-none shadow-soft glass">
                    <CardContent className="pt-6 space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                name="fullName"
                                placeholder="Full Name"
                                value={form.fullName}
                                onChange={handleChange}
                                className="bg-background/50 border-muted h-11"
                            />

                            <div className="grid grid-cols-1 gap-4">
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="bg-background/50 border-muted h-11"
                                />
                                <Input
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="bg-background/50 border-muted h-11"
                                />
                            </div>

                            <Input
                                name="password"
                                type="password"
                                placeholder="Create Password"
                                value={form.password}
                                onChange={handleChange}
                                className="bg-background/50 border-muted h-11"
                            />

                            <Button type="submit" className="w-full h-11 font-medium" disabled={loading}>
                                {loading ? "Creating Profile..." : (
                                    <span className="flex items-center gap-2">
                                        <UserPlus size={18} /> Get Started
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-muted"></div>
                            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase font-medium">or</span>
                            <div className="flex-grow border-t border-muted"></div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-11 flex gap-2 border-muted hover:bg-muted/50"
                            disabled
                        >
                            <Chrome className="w-4 h-4" />
                            Continue with Google
                        </Button>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    Already registered?{" "}
                    <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;