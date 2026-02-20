import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function QRScanner() {
    const navigate = useNavigate();
    const scannerRef = useRef<Html5Qrcode | null>(null);

    // 🔥 The Lock: Prevents multiple triggers
    const isProcessing = useRef(false);

    const [isStarting, setIsStarting] = useState(true);
    const [isTabUpload, setIsTabUpload] = useState(false);

    const stopAndCleanup = async () => {
        if (scannerRef.current) {
            try {
                // Check if it's actually running before stopping
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
            } catch (err) {
                console.warn("Cleanup warning (usually safe to ignore):", err);
            } finally {
                scannerRef.current = null;
            }
        }
    };

    useEffect(() => {
        if (isTabUpload) {
            stopAndCleanup();
            return;
        }

        const elementId = "reader";
        const scanner = new Html5Qrcode(elementId);
        scannerRef.current = scanner;

        scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            async (decodedText) => {
                // 1. Check if we are already handling a success
                if (isProcessing.current) return;

                // 2. Lock the scanner immediately
                isProcessing.current = true;

                toast.success("QR Code Detected");

                // 3. Force stop the camera before moving
                await stopAndCleanup();

                // 4. Navigate
                navigate(`/pg/${decodedText}`, { replace: true });
            },
            () => { /* Silent failure for frames with no QR */ }
        )
            .then(() => setIsStarting(false))
            .catch((err) => {
                setIsStarting(false);
                console.error(err);
            });

        return () => {
            stopAndCleanup();
        };
    }, [navigate, isTabUpload]);

    // ... handleFileUpload remains the same as previous response ...

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a temporary scanner to scan the file
        const fileScanner = new Html5Qrcode("file-scan-temp", { verbose: false });
        try {
            const result = await fileScanner.scanFile(file, true);
            navigate(`/pg/${result}`);
        } catch (err) {
            toast.error("Could not find a valid QR code in this image");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 flex flex-col items-center space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Scan PG Code</h2>
                <p className="text-sm text-muted-foreground">Scan the QR code at the PG or upload an image</p>
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-muted p-1 rounded-xl w-full">
                <Button
                    variant={!isTabUpload ? "secondary" : "ghost"}
                    className="flex-1 rounded-lg gap-2"
                    onClick={() => setIsTabUpload(false)}
                >
                    <Camera className="w-4 h-4" /> Camera
                </Button>
                <Button
                    variant={isTabUpload ? "secondary" : "ghost"}
                    className="flex-1 rounded-lg gap-2"
                    onClick={() => setIsTabUpload(true)}
                >
                    <Upload className="w-4 h-4" /> Upload
                </Button>
            </div>

            <Card className="relative w-full aspect-square overflow-hidden bg-black rounded-3xl border-4 border-muted flex items-center justify-center">
                {!isTabUpload ? (
                    <>
                        <div id="reader" className="w-full h-full" />
                        {isStarting && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span className="text-xs text-white">Opening Camera...</span>
                            </div>
                        )}
                        {/* QR Frame Overlay */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="w-[250px] h-[250px] border-2 border-primary/50 rounded-2xl animate-pulse" />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <label className="cursor-pointer">
                            <span className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium">
                                Choose Image
                            </span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        </label>
                        <p className="text-xs text-muted-foreground">Select a clear photo of the QR code</p>
                    </div>
                )}
            </Card>

            <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
                <XCircle className="w-4 h-4" /> Cancel
            </Button>

            {/* Hidden div for file scanning logic */}
            <div id="file-scan-temp" className="hidden" />
        </div>
    );
}