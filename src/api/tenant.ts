// src/api/tenant.ts
import { apiPrivate } from "@/lib/api";

export const updateProfile = (data: any) =>
    apiPrivate.patch("/tenants/me", data);

export const updatePassword = (data: {
    currentPass: string;
    newPass: string;
}) => apiPrivate.patch("/tenants/me/password", data);

export const uploadProfileImage = (file: File) => {
    const fd = new FormData();
    fd.append("profileImage", file);
    return apiPrivate.patch("/tenants/me/profile-image", fd);
};

export const deleteProfile = () =>
    apiPrivate.delete("/tenants/me");

/* ---------- KYC ---------- */

export const createKyc = (data: FormData) =>
    apiPrivate.post("/tenants/kyc", data);

export const updateKyc = (docId: string, data: FormData) =>
    apiPrivate.patch(`/tenants/kyc/${docId}`, data);

export const deleteKyc = (docId: string) =>
    apiPrivate.delete(`/tenants/kyc/${docId}`);
