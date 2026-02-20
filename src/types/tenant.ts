export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Tenant {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: Gender;
    profileImage?: string;
    kycs?: Kyc[];
    createdAt?: string;
}

export interface Kyc {
    id: string;
    documentType: string;
    documentNo?: string;
    documentUrl: string;
    status: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED";
    rejectionReason?: string;
}
