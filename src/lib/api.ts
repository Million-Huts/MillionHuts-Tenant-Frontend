import axios from 'axios';

const PRIMARY_API = import.meta.env.VITE_API_URL;
const BACKUP_API = import.meta.env.VITE_BACKUP_API_URL;

let ACTIVE_BASE_URL = PRIMARY_API;

const checkServer = async (url: string) => {
    try {
        let finalUrl = url;
        if (url.endsWith('/api/v1'))
            finalUrl = url.split('/api/v1')[0];
        await axios.get(finalUrl, { timeout: 3000 });
        return true;
    } catch {
        return false;
    }
};

export const initApiBase = async () => {
    const isPrimaryUp = await checkServer(PRIMARY_API);

    if (isPrimaryUp) {
        ACTIVE_BASE_URL = PRIMARY_API;
        console.log("✅ Using PRIMARY backend");
    } else {
        const isBackupUp = await checkServer(BACKUP_API);

        if (isBackupUp) {
            ACTIVE_BASE_URL = BACKUP_API;
            console.log("⚠️ Primary down, switched to BACKUP");
        } else {
            console.error("❌ Both backends are down");
        }
    }

    // Update axios instances dynamically
    api.defaults.baseURL = ACTIVE_BASE_URL;
    apiPrivate.defaults.baseURL = ACTIVE_BASE_URL;
};

export const api = axios.create({
    baseURL: ACTIVE_BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

export const apiPrivate = axios.create({
    baseURL: ACTIVE_BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach(p => (error ? p.reject(error) : p.resolve()));
    failedQueue = [];
};

apiPrivate.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => apiPrivate(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post('/auth/refresh');
                processQueue();
                return apiPrivate(originalRequest);
            } catch (err) {
                processQueue(err);
                throw err;
            } finally {
                isRefreshing = false;
            }
        }

        throw error;
    }
);
