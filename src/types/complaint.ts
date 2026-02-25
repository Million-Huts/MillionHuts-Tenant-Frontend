export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REOPENED';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ComplaintCategory =
    | 'ELECTRICAL'
    | 'PLUMBING'
    | 'CLEANING'
    | 'INTERNET'
    | 'FOOD'
    | 'SECURITY'
    | 'MAINTENANCE'
    | 'OTHER';

export interface ComplaintMedia {
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
}

export interface Complaint {
    id: string;
    title: string;
    description: string;
    status: ComplaintStatus;
    priority: ComplaintPriority;
    category: ComplaintCategory;
    media?: ComplaintMedia[];

    // Relations
    tenantId: string;
    pgId: string;

    // Timeline
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string | null;
}

// For the creation form specifically
export interface CreateComplaintInput {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    pgId?: string;
    media?: File[];
}