import type { Tenant } from "./tenant";

// src/types/auth.ts
export interface TenantPublic extends Tenant { }

export interface AuthContextType {
    tenant: TenantPublic | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshTenant: () => Promise<void>;
}
