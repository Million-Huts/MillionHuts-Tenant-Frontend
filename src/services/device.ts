import { apiPrivate } from "@/lib/api";

export const registerDevice = async (fcmToken: string) => {
    try {
        await apiPrivate.post("/device/register", {
            fcmToken,
            platform: "WEB",
            deviceName: navigator.userAgent,
        });
    } catch (error) {
        console.error("Device register failed", error);
    }
};