import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase";

export const initPush = async () => {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") return null;

    const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    return token;
};