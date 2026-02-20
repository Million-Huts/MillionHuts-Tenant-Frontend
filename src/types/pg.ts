export interface PG {
    id: string;
    pgCode: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;

    coverImage?: {
        url: string;
    } | null;

    details?: {
        pgType?: string | null;
        messAvailable?: boolean | null;
        messType?: string | null;
        rentStart?: number | null;
        rentUpto?: number | null;
        contactNumber?: string | null;
    } | null;
}
