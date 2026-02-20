export type ApplicationStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED";

export interface PGDetails {
    rentStart?: number | null;
    rentUpto?: number | null;
    pgType?: string | null;
}

export interface PG {
    id: string;
    pgCode: string;
    name: string;
    city: string;
    state: string;
    coverImage?: {
        url: string;
    } | null;
    details?: PGDetails | null;
}

export interface TenantApplication {
    id: string;
    status: ApplicationStatus;
    message?: string | null;
    createdAt: string;
    pg: PG;
}
