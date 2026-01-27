import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

export const apiPrivate = axios.create({
    baseURL: BASE_URL,
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
