import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Chrome } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier || !password) {
            return toast.error("Please fill all fields");
        }

        try {
            setLoading(true);
            await login(identifier, password);
            toast.success("Login successful");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Login to <span className="text-blue-600">MillionHuts</span>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Email or Phone"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />

                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-2">
                        <div className="flex-1 h-px bg-muted" />
                        <span className="text-sm text-muted-foreground">OR</span>
                        <div className="flex-1 h-px bg-muted" />
                    </div>

                    {/* Google Button */}
                    <Button
                        variant="outline"
                        className="w-full flex gap-2"
                        disabled
                    >
                        <Chrome className="w-5 h-5" />
                        Continue with Google
                    </Button>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don’t have an account?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
