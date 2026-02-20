import type { StayRecord } from "@/types/stay";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Calendar, IndianRupee, DoorOpen } from "lucide-react";
import { Badge } from "../ui/badge";

export default function ActiveStay({ stay }: { stay: StayRecord }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold tracking-tight">My Current Stay</h2>
            </div>

            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
                    <div>
                        <p className="text-xs opacity-80 uppercase tracking-wider font-semibold">Active Residence</p>
                        {/* <h3 className="text-lg font-bold">{stay.pg?.name || "PG Residence"}</h3> */}
                        <h3 className="text-lg font-bold">{"PG Residence"}</h3>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                        Occupied
                    </Badge>
                </div>

                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg"><DoorOpen className="w-5 h-5 text-primary" /></div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Room ID</p>
                            <p className="font-bold">{stay.roomId}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg"><IndianRupee className="w-5 h-5 text-primary" /></div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Monthly Rent</p>
                            <p className="font-bold">₹{stay.rent.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg"><Calendar className="w-5 h-5 text-primary" /></div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Started On</p>
                            <p className="font-bold">{new Date(stay.startDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}