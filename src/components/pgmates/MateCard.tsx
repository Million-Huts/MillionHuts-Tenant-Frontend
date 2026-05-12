import { ShieldCheck, BedDouble, Layers, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PGMate } from "@/types/pgmates";

// Deterministic color from name — same name always gets same color
const AVATAR_COLORS = [
    "bg-violet-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
];

function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

interface MateCardProps {
    mate: PGMate;
}

export default function MateCard({ mate }: MateCardProps) {
    const avatarColor = getAvatarColor(mate.fullName);
    const initials = getInitials(mate.fullName);

    return (
        <Card className="group relative overflow-hidden border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200">
            {/* Top accent line on hover */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="p-5 space-y-4">
                {/* Avatar + Name row */}
                <div className="flex items-center gap-4">
                    {/* Pseudo avatar — initials only, no image */}
                    <div
                        className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm",
                            avatarColor
                        )}
                    >
                        {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground truncate">{mate.fullName}</p>
                        {mate.gender && (
                            <p className="text-xs text-muted-foreground capitalize">
                                {mate.gender.toLowerCase()}
                            </p>
                        )}
                    </div>

                    {/* KYC badge */}
                    {mate.kycVerified ? (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shrink-0">
                            <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                Verified
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted border border-border shrink-0">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Pending
                            </span>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Room + Floor info */}
                <div className="flex items-center gap-4">
                    {mate.room && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <BedDouble className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="font-medium">{mate.room.name}</span>
                            <span className="text-muted-foreground/50">·</span>
                            <span className="capitalize">{mate.room.sharing.toLowerCase()} sharing</span>
                        </div>
                    )}

                    {mate.floor && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                            <Layers className="h-3.5 w-3.5 shrink-0" />
                            <span className="font-medium">{mate.floor.label}</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
