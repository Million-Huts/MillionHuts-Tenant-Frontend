import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Search, QrCode } from "lucide-react";

export default function JoinPG() {
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!code) return;
        navigate(`/pg/${code}`);
    };

    return (
        <Card className="max-w-xl border-dashed border-2 bg-muted/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" />
                    Find Your New Home
                </CardTitle>
                <CardDescription>
                    Enter the unique PG code shared by your owner or scan the QR code at the property.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="e.g. PG-1234"
                        className="bg-background"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} className="px-6">
                        Search
                    </Button>
                </div>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-muted px-2 text-muted-foreground font-medium">Or</span></div>
                </div>

                <Button
                    variant="outline"
                    className="w-full gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                    onClick={() => navigate("/scan")}
                >
                    <QrCode className="w-4 h-4" />
                    Scan QR Code
                </Button>
            </CardContent>
        </Card>
    );
}