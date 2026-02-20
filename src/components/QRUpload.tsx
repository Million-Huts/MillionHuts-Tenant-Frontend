import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function QRUpload() {
    const navigate = useNavigate();

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // "qr-upload-node" is just a target for the internal engine, doesn't need to be visible
        const scanner = new Html5Qrcode("qr-upload-node");

        try {
            const result = await scanner.scanFile(file, true);
            toast.success("Code scanned successfully");
            navigate(`/pg/${result}`);
        } catch (err) {
            toast.error("Invalid QR code. Please try a clearer image.");
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-2xl bg-muted/30 gap-4">
            <div className="p-3 bg-background rounded-full shadow-sm">
                <ImageIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
                <h3 className="font-semibold">Upload QR Image</h3>
                <p className="text-xs text-muted-foreground">JPG, PNG or WEBP</p>
            </div>

            <label className="w-full">
                <Button variant="outline" className="w-full pointer-events-none gap-2">
                    <Upload className="w-4 h-4" /> Select File
                </Button>
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFile}
                />
            </label>

            {/* Engine Target */}
            <div id="qr-upload-node" className="hidden" />
        </div>
    );
}