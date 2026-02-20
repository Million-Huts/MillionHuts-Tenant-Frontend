"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    IndianRupee,
    Home,
    Utensils,
    ArrowLeft,
    Loader2,
    ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";
import type { PG } from "@/types/pg";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export default function PGPage() {
    const { pgCode } = useParams();
    const navigate = useNavigate();

    const [pg, setPg] = useState<PG | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchPG = async () => {
            try {
                const res = await apiPrivate.get(`/pg/${pgCode}`);
                setPg(res.data.data);
            } catch (err) {
                toast.error("Could not find this property");
                navigate("/dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchPG();
    }, [pgCode, navigate]);

    const handleApply = async () => {
        if (!pg) return;

        try {
            setApplying(true);
            await apiPrivate.post("/applications", {
                pgId: pg.id,
                message,
            });
            toast.success("Application sent to owner!");
            navigate("/dashboard", { replace: true });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to submit application");
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="relative h-screen">
                <LoadingOverlay message="Loading PG Info..." isLoading={loading} />
            </div>
        );
    }

    if (!pg) return null;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header Actions */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-2 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Image & Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="relative aspect-video rounded-3xl overflow-hidden border shadow-sm">
                        <img
                            src={pg.coverImage?.url || "/placeholder.jpg"}
                            alt={pg.name}
                            className="w-full h-full object-contain"
                        />
                        <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-md text-foreground border-none">
                            {pg.details?.pgType || "Residential"}
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight">{pg.name}</h1>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{pg.address}, {pg.city}, {pg.state}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                            <div className="p-4 rounded-2xl bg-muted/50 border border-muted flex flex-col gap-1">
                                <IndianRupee className="w-5 h-5 text-primary mb-1" />
                                <span className="text-xs text-muted-foreground font-medium uppercase">Starts at</span>
                                <span className="font-bold">₹{pg.details?.rentStart}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-muted/50 border border-muted flex flex-col gap-1">
                                <Home className="w-5 h-5 text-primary mb-1" />
                                <span className="text-xs text-muted-foreground font-medium uppercase">Property Type</span>
                                <span className="font-bold">{pg.details?.pgType?.toLowerCase() || "PG"}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-muted/50 border border-muted flex flex-col gap-1">
                                <Utensils className="w-5 h-5 text-primary mb-1" />
                                <span className="text-xs text-muted-foreground font-medium uppercase">Food/Mess</span>
                                <span className="font-bold">{pg.details?.messAvailable ? "Available" : "Not Provided"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Application Sidebar */}
                <div className="space-y-6">
                    <Card className="sticky top-6 border-primary/10 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
                        <div className="p-6 bg-primary/5 border-b border-primary/10">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                Join this PG
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">Submit your interest to the owner.</p>
                        </div>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Message (Optional)
                                </label>
                                <Textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="e.g. I'm looking for a double sharing room starting next week."
                                    className="resize-none rounded-xl"
                                    rows={4}
                                />
                            </div>

                            <Button
                                onClick={handleApply}
                                disabled={applying}
                                className="w-full h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20"
                            >
                                {applying ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : "Apply Now"}
                            </Button>

                            <p className="text-[10px] text-center text-muted-foreground leading-tight">
                                By clicking apply, your profile details and KYC documents will be shared with the owner.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}