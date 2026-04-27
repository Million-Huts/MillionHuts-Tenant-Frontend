import type { StayRecord } from "./stay";
import type { Tenant } from "./tenant";

export interface AuthContextType {
    tenant: Tenant | null;
    stayRecords: StayRecord | null;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
}
