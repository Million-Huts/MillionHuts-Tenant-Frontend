import { getFcmToken } from "./fcm";
import { registerDevice } from "./device";

export const initFcm = async () => {
    try {
        const token = await getFcmToken();

        if (!token) return;

        await registerDevice(token);
    } catch (error) {
        console.error("FCM init error", error);
    }
};