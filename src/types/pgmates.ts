/*
========================================
PG MATE
========================================
*/

export interface PGMate {
    id: string;
    fullName: string;
    gender?: "MALE" | "FEMALE" | "OTHER" | null;
    kycVerified: boolean;

    room?: {
        id: string;
        name: string;
        sharing: string;
    } | null;

    floor?: {
        id: string;
        label: string;
    } | null;

    stayStartDate?: string | null;
}

/*
========================================
API RESPONSE
========================================
*/

export interface PGMatesResponse {
    data: PGMate[];
    total: number;
}
