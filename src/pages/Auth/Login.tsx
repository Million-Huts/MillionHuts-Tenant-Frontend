import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Chrome, ArrowRight, Home } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier.trim() || !password) {
            return toast.error("Please fill all fields");
        }

        try {
            setLoading(true);
            await login(identifier.trim(), password);
            toast.success("Welcome back!");
            navigate("/dashboard", { replace: true });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-2">
                        <Home size={24} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">MillionHuts</h1>
                    <p className="text-muted-foreground text-sm px-8">
                        Enter your credentials to access your tenant dashboard.
                    </p>
                </div>

                <Card className="border-none shadow-soft glass">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <Input
                                    className="bg-background/50 border-muted"
                                    placeholder="Email or Phone"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <Input
                                    className="bg-background/50 border-muted"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 group transition-all"
                                disabled={loading}
                            >
                                {loading ? "Authenticating..." : (
                                    <span className="flex items-center gap-2">
                                        Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-muted" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground font-medium">
                                    Trusted Login
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-11 flex gap-2 border-muted hover:bg-muted/50"
                            disabled
                        >
                            <Chrome className="w-4 h-4" />
                            Sign in with Google
                        </Button>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    New here?{" "}
                    <Link to="/register" className="text-primary font-semibold hover:underline underline-offset-4">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;