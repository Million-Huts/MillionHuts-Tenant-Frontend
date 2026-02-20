import type { TenantApplication } from "@/types/application";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";

const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    APPROVED: "bg-green-100 text-green-700 border-green-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
};

export default function ApplicationsList({ applications }: { applications: TenantApplication[] }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-xl font-bold tracking-tight">Active Applications</h2>
            </div>

            <div className="grid gap-4">
                {applications.map((app) => (
                    <Card key={app.id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition-shadow">
                        <img
                            src={app.pg?.coverImage?.url || "/placeholder.jpg"}
                            alt={app.pg?.name}
                            className="w-full sm:w-24 h-24 rounded-xl object-cover ring-1 ring-muted"
                        />

                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg">{app.pg?.name}</h3>
                                <Badge className={statusStyles[app.status] || "bg-gray-100"}>
                                    {app.status}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5" />
                                {app.pg?.city}, {app.pg?.state}
                            </div>

                            <p className="text-xs text-muted-foreground pt-2">
                                Applied on {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}