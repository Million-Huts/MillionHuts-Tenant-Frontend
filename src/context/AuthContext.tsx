import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { api, apiPrivate } from "@/lib/api";
import type { AuthContextType } from "@/types/auth";
import type { StayRecord } from "@/types/stay";
import type { Tenant } from "@/types/tenant";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [stayRecord, setStayRecord] = useState<StayRecord | null>(null);

    const [loading, setLoading] = useState(true);
    const [initialised, setInitialised] = useState(false);

    // ======================================================
    // FETCH CURRENT TENANT
    // ======================================================
    const fetchMe = async () => {
        try {
            const res = await apiPrivate.get("/auth/me");

            const tenantData = res.data?.data?.tenant ?? null;
            const stayData = res.data?.data?.stay ?? null;

            setTenant(tenantData);
            setStayRecord(stayData);
        } catch {
            // session invalid / not logged in
            setTenant(null);
            setStayRecord(null);
        } finally {
            setLoading(false);
            setInitialised(true);
        }
    };

    // ======================================================
    // LOGOUT
    // ======================================================
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            // ignore errors
        } finally {
            setTenant(null);
            setStayRecord(null);
        }
    };

    // ======================================================
    // INITIAL LOAD
    // ======================================================
    useEffect(() => {
        if (!initialised) {
            fetchMe();
        }
    }, [initialised]);

    const value: AuthContextType = {
        tenant,
        stayRecords: stayRecord, // keep compatibility if needed
        loading,
        isAuthenticated: !!tenant,
        logout,
        fetchMe,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};

