import type { Complaint } from "@/types/complaint";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlertCircle, ChevronRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
    OPEN: "bg-amber-500/10 text-amber-600 border-amber-200/50",
    IN_PROGRESS: "bg-blue-500/10 text-blue-600 border-blue-200/50",
    RESOLVED: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
    CLOSED: "bg-slate-500/10 text-slate-600 border-slate-200/50",
    REOPENED: "bg-orange-500/10 text-orange-600 border-orange-200/50",
};

const priorityStyles: Record<string, string> = {
    LOW: "text-slate-500",
    MEDIUM: "text-blue-500",
    HIGH: "text-orange-500",
    URGENT: "text-rose-600 font-black animate-pulse",
};

export function ComplaintCard({ complaint, onClick }: { complaint: Complaint; onClick: () => void }) {
    return (
        <Card
            onClick={onClick}
            className="group relative overflow-hidden border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
        >
            {/* Left Accent Strip based on Priority */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 opacity-20",
                complaint.priority === 'URGENT' ? 'bg-rose-600 opacity-100' : 'bg-primary'
            )} />

            <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-wider", statusStyles[complaint.status])}>
                            {complaint.status.replace("_", " ")}
                        </Badge>
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {complaint.category}
                        </span>
                    </div>

                    <div>
                        <h3 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                            {complaint.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                            {complaint.description}
                        </p>
                    </div>
                </div>

                <div className="hidden sm:flex items-center self-center text-muted-foreground/30 group-hover:text-primary transition-colors">
                    <ChevronRight className="h-6 w-6" />
                </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-border/50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className={cn("h-2 w-2 rounded-full",
                            complaint.priority === 'URGENT' ? 'bg-rose-600' :
                                complaint.priority === 'HIGH' ? 'bg-orange-500' : 'bg-slate-300'
                        )} />
                        <span className={cn("text-xs font-bold uppercase tracking-tighter", priorityStyles[complaint.priority])}>
                            {complaint.priority} Priority
                        </span>
                    </div>
                </div>

                <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                </div>
            </div>
        </Card>
    );
}