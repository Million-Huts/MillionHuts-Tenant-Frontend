import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { Chrome } from "lucide-react";

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

        if (!form.fullName || !form.password) {
            return toast.error("Please fill required fields");
        }

        try {
            setLoading(true);
            await api.post("/auth/register", form);
            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Create your <span className="text-blue-600">Tenant Account</span>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            name="fullName"
                            placeholder="Full Name"
                            value={form.fullName}
                            onChange={handleChange}
                        />

                        <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <Input
                            name="phone"
                            placeholder="Phone"
                            value={form.phone}
                            onChange={handleChange}
                        />

                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating account..." : "Register"}
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
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;
