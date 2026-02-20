import type { StayRecord } from "./stay";
import type { Tenant } from "./tenant";

export interface AuthContextType {
    tenant: Tenant | null;
    stayRecords: StayRecord | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshTenant: () => Promise<void>;
}
