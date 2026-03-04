import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export const useNotificationsSocket = (
    onNewNotification: (data: any) => void
) => {
    useEffect(() => {
        const socket = getSocket();

        if (!socket) return;

        socket.on("notification:new", onNewNotification);

        return () => {
            socket.off("notification:new", onNewNotification);
        };
    }, [onNewNotification]);
};