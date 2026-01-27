// src/context/AuthContext.tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { api, apiPrivate } from '../lib/api';
import type { TenantPublic, AuthContextType } from '../types/Auth';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [tenant, setTenant] = useState<TenantPublic | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshTenant = async () => {
        try {
            const res = await apiPrivate.get('/auth/me');
            setTenant(res.data.tenant);
        } catch (error: any) {
            // Session expired or invalid
            setTenant(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (identifier: string, password: string) => {
        await api.post('/auth/login', { identifier, password });
        await refreshTenant();
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // ignore server failure
        } finally {
            setTenant(null);
        }
    };

    // Load tenant on app mount
    useEffect(() => {
        refreshTenant();
    }, []);

    const value: AuthContextType = {
        tenant,
        loading,
        isAuthenticated: !!tenant,
        login,
        logout,
        refreshTenant,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};