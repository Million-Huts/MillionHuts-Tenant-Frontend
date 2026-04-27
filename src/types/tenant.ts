/*
========================================
ENUMS
========================================
*/

export type Gender =
    | "MALE"
    | "FEMALE"
    | "OTHER";

export type TenantStatus =
    | "ACTIVE"
    | "BLOCKED"
    | "DELETED";

export type KycStatus =
    | "PENDING"
    | "SUBMITTED"
    | "VERIFIED"
    | "REJECTED";

export type KycType =
    | "AADHAR"
    | "PAN"
    | "PASSPORT"
    | "DRIVING_LICENSE";

/*
========================================
KYC
========================================
*/

export interface Kyc {
    id: string;

    documentType: KycType;
    documentNo?: string | null;
    documentUrl: string;

    status: KycStatus;
    rejectionReason?: string | null;

    verifiedAt?: string | null;

    createdAt: string;
    updatedAt: string;
}

/*
========================================
TENANT
========================================
*/

export interface Tenant {
    id: string;

    fullName: string;
    email?: string | null;
    phone?: string | null;

    dateOfBirth?: string | null;
    gender?: Gender | null;

    profileImage?: string | null;

    status: TenantStatus;

    emailVerified: boolean;

    // Relations
    kycs: Kyc[];

    // Metadata
    createdAt: string;
    updatedAt: string;
}