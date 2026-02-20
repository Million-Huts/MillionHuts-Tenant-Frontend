export interface StayRecord {
    id?: string;
    pgId: string;
    tenantId: string;
    roomId: string;
    rent: number;
    deposit: number;
    startDate: string;
    endDate?: string;
    status?: "ACTIVE" | "VACATED" | "TERMINATED";
}