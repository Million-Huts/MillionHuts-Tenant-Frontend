import type { Complaint } from "@/types/complaint"; // Move interface to a types file or keep at top
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
    OPEN: "bg-amber-50 text-amber-700 border-amber-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CLOSED: "bg-slate-50 text-slate-700 border-slate-200",
    REOPENED: "bg-orange-50 text-orange-700 border-orange-200",
};

const priorityColors: Record<string, string> = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-blue-100 text-blue-600",
    HIGH: "bg-orange-100 text-orange-600",
    URGENT: "bg-rose-100 text-rose-600 animate-pulse",
};

export function ComplaintCard({ complaint, onClick }: { complaint: Complaint; onClick: () => void }) {
    return (
        <Card
            onClick={onClick}
            className="p-4 hover:shadow-md transition-all cursor-pointer border-slate-200 rounded-2xl active:scale-[0.98]"
        >
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 leading-tight">{complaint.title}</h3>
                        <Badge variant="outline" className={`text-[10px] font-black uppercase ${statusColors[complaint.status]}`}>
                            {complaint.status.replace("_", " ")}
                        </Badge>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1">{complaint.description}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                <div className="flex gap-2">
                    <Badge className={`text-[10px] font-bold rounded-lg ${priorityColors[complaint.priority]}`}>
                        {complaint.priority}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {complaint.category}
                    </span>
                </div>
                <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                </div>
            </div>
        </Card>
    );
}