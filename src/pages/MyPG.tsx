import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiPrivate } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MapPin, BedDouble, IndianRupee, Loader2,
    Image as ImageIcon, Phone, AlertCircle, ShieldCheck, Utensils
} from "lucide-react";
import toast from "react-hot-toast";
import GalleryModal from "@/components/my-pg/GalleryModal";

export default function MyPG() {
    const { stayRecords } = useAuth();
    const [pg, setPg] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const fetchPG = async () => {
        if (!stayRecords?.pg?.pgCode) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await apiPrivate.get(`/pg/${stayRecords.pg.pgCode}`);
            setPg(res.data?.data || res.data);
        } catch (err) {
            toast.error("Failed to load PG details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPG(); }, []);

    if (loading) return (
        <div className="h-[70vh] flex flex-col items-center justify-center animate-pulse">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="font-bold tracking-tighter text-muted-foreground uppercase text-xs">Architecting your stay...</p>
        </div>
    );

    if (!pg) return <div className="p-20 text-center font-bold">No stay record found.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Hero Section */}
            <div className="relative h-[300px] md:h-[400px] w-full rounded-3xl overflow-hidden group">
                <img
                    src={pg.images?.[0]?.url || "/placeholder.jpg"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div className="text-white space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {pg.details?.pgType} PG
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">{pg.name}</h1>
                        <p className="text-sm opacity-80 flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {pg.address}, {pg.city}
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsGalleryOpen(true)}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-white/20 rounded-xl"
                    >
                        <ImageIcon className="h-4 w-4 mr-2" /> View {pg.images?.length} Photos
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={BedDouble} label="My Room" value={stayRecords?.roomId || "N/A"} />
                <StatCard icon={IndianRupee} label="Monthly Rent" value={`₹${stayRecords?.rent}`} />
                <StatCard icon={Utensils} label="Food Service" value={pg.details?.messAvailable ? "Available" : "Self"} />
                <StatCard icon={ShieldCheck} label="Status" value={pg.status} isStatus />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Main Details */}
                <div className="lg:col-span-2 space-y-10">
                    <AmenitySection amenities={pg.pgAmenities} />
                    <RulesSection rules={pg.pgRules} />
                </div>

                {/* Right: Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-border/40 bg-muted/20 overflow-hidden">
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-bold text-lg">Residence Info</h3>
                            <div className="space-y-4">
                                <InfoRow label="Rent Cycle" value={`Day ${pg.details?.rentCycleDay} of month`} />
                                <InfoRow label="Late Fee" value={`₹${pg.details?.lateFee}`} />
                                <InfoRow label="Total Floors" value={pg.details?.totalFloors} />
                                <InfoRow label="Notice Period" value={pg.details?.noticePeriod || "1 Month"} />
                            </div>
                            <div className="pt-4 space-y-3">
                                <Button className="w-full h-12 rounded-xl" asChild>
                                    <a href={`tel:${pg.details?.contactNumber}`}>
                                        <Phone className="mr-2 h-4 w-4" /> Contact Manager
                                    </a>
                                </Button>
                                <Button variant="outline" className="w-full h-12 rounded-xl" asChild>
                                    <a href="/complaints">
                                        <AlertCircle className="mr-2 h-4 w-4" /> Raise Issue
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <GalleryModal
                images={pg.images}
                open={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
            />
        </div>
    );
}

// Small helper for cleaner UI
const StatCard = ({ icon: Icon, label, value, isStatus }: any) => (
    <Card className="border-border/40 bg-card">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</p>
            <p className={`text-sm font-bold ${isStatus ? 'text-emerald-500 uppercase' : ''}`}>{value}</p>
        </CardContent>
    </Card>
);

const InfoRow = ({ label, value }: { label: string, value: any }) => (
    <div className="flex justify-between items-center border-b border-border/20 pb-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-bold">{value}</span>
    </div>
);

// PG Amenities Section
const AmenitySection = ({ amenities }: { amenities: any[] }) => (
    <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Amenities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {amenities.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card/50">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-xs font-medium">{item.amenity.name}</span>
                </div>
            ))}
        </div>
    </div>
);

// PG Rules Section
const RulesSection = ({ rules }: { rules: any[] }) => (
    <div className="space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">House Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rules[0]?.sections.map((section: any) => (
                <div key={section.id} className="space-y-3">
                    <h4 className="text-sm font-bold text-primary">{section.title}</h4>
                    <ul className="space-y-2">
                        {section.items.map((rule: any) => (
                            <li key={rule.id} className="text-xs text-muted-foreground flex gap-2">
                                <span className="text-primary">•</span>
                                <div>
                                    <span className="font-bold text-foreground block">{rule.name}</span>
                                    {rule.description}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);