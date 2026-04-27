/*
========================================
ENUMS
========================================
*/

export type StayStatus =
    | "ACTIVE"
    | "VACATED"
    | "TERMINATED";

/*
========================================
ROOM (LIGHT)
========================================
*/

export interface Room {
    id: string;
    name: string;

    sharing: "SINGLE" | "DOUBLE" | "TRIPLE" | "FOUR" | "FIVE";
    capacity: number;

    rent?: number | null;
}

/*
========================================
PG (LIGHT)
========================================
*/

export interface StayPG {
    id: string;
    name: string;
    pgCode: string;

    city: string;
    state: string;

    coverImage?: {
        url: string;
    } | null;
}

/*
========================================
ROOM TRANSFER
========================================
*/

export interface RoomTransfer {
    id: string;

    fromRoomId: string;
    toRoomId: string;

    reason?: string | null;

    createdAt: string;
}

/*
========================================
STAY RECORD
========================================
*/

export interface StayRecord {
    id: string;

    tenantId: string;
    pgId: string;
    roomId?: string | null;

    rent: number;
    deposit?: number | null;

    startDate: string;
    endDate?: string | null;

    status: StayStatus;

    // Agreement
    agreementUrl?: string | null;
    agreementSignedAt?: string | null;

    // Exit
    moveOutReason?: string | null;
    vacatedAt?: string | null;

    // Relations
    pg?: StayPG;
    room?: Room;

    // Transfers
    transfers?: RoomTransfer[];

    createdAt: string;
}