import { createAxiosInstance } from "./axiosInstance";

const BASE_URL = import.meta.env.VITE_SERVER_ENDPOINT;

export const api = createAxiosInstance({
    url: BASE_URL,
    baseURL: BASE_URL,
    timeout: 300000,
    headers: {
        'Content-Type': 'application/json',
    }
})