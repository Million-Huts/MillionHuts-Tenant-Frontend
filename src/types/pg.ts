/*
========================================
ENUMS
========================================
*/

export type PGType =
    | "MENS"
    | "WOMENS"
    | "COLIVING";

export type MessType =
    | "VEG"
    | "NON_VEG"
    | "MIXED";

export type PGStatus =
    | "DRAFT"
    | "ACTIVE"
    | "INACTIVE"
    | "ARCHIVED";

/*
========================================
COMMON TYPES
========================================
*/

export interface PGImage {
    id: string;
    url: string;
}

export interface PGDetails {
    pgType?: PGType | null;
    messAvailable?: boolean | null;
    messType?: MessType | null;

    rentStart?: number | null;
    rentUpto?: number | null;

    contactNumber?: string | null;
}

/*
========================================
PG CARD (LIST / SEARCH)
========================================
*/

export interface PGCard {
    id: string;
    pgCode: string;
    name: string;

    city: string;
    state: string;

    locality?: string | null;
    formattedAddress?: string | null;

    coverImage?: PGImage | null;
    details?: PGDetails | null;
}

/*
========================================
PG FULL DETAILS
========================================
*/

export interface PGFull extends PGCard {
    address: string;
    pincode: string;

    images?: PGImage[];

    pgAmenities?: {
        amenity: {
            name: string;
            icon?: string | null;
        };
    }[];

    pgCustomAmenities?: {
        name: string;
        icon?: string | null;
    }[];

    pgRules?: {
        sections: {
            title: string;
            items: {
                name: string;
                description?: string | null;
            }[];
        }[];
    };
}

/*
========================================
API RESPONSES
========================================
*/

export interface PGListResponse {
    data: PGCard[];
}

export interface PGDetailsResponse {
    data: PGFull;
}
