import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../lib/firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    return permission === "granted";
};

export const getFcmToken = async (): Promise<string | null> => {
    try {
        const granted = await requestNotificationPermission();

        if (!granted) return null;

        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
        });

        return token ?? null;
    } catch (error) {
        console.error("FCM token error:", error);
        return null;
    }
};

/**
 * Foreground listener
 */
export const listenForegroundMessages = (
    callback: (payload: any) => void
) => {
    onMessage(messaging, (payload) => {
        callback(payload);
    });
};