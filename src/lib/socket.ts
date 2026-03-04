import { io, Socket } from "socket.io-client";

const CORE_URL = import.meta.env.VITE_API_URL as string;

let socket: Socket | null = null;

/*
========================================
INIT SOCKET
========================================
*/

export const connectSocket = (userId: string) => {
    if (socket && socket.connected) return socket;

    socket = io(CORE_URL, {
        query: {
            userId,
        },
        transports: ["websocket"],
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });

    return socket;
};

/*
========================================
GET SOCKET
========================================
*/

export const getSocket = () => {
    return socket;
};

/*
========================================
DISCONNECT
========================================
*/

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};