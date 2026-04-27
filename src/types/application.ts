/*
========================================
ENUMS
========================================
*/

export type ApplicationStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED";

export type PGType =
    | "MENS"
    | "WOMENS"
    | "COLIVING";

/*
========================================
PG TYPES (LIGHT VERSION)
Used in applications list
========================================
*/

export interface PGDetails {
    rentStart?: number | null;
    rentUpto?: number | null;
    pgType?: PGType | null;
}

export interface PG {
    id: string;
    pgCode: string;
    name: string;
    city: string;
    state: string;

    locality?: string | null;
    formattedAddress?: string | null;

    coverImage?: {
        url: string;
    } | null;

    details?: PGDetails | null;
}

/*
========================================
APPLICATION
========================================
*/

export interface TenantApplication {
    id: string;
    status: ApplicationStatus;
    message?: string | null;

    createdAt: string;
    updatedAt?: string;

    pg: PG;
}

/*
========================================
API RESPONSES
========================================
*/

export interface ApplicationListResponse {
    data: TenantApplication[];
    page?: number;
    limit?: number;
}

export interface ApplicationSingleResponse {
    data: TenantApplication;
}
