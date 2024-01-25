import axios from 'axios';
import { localStorageService } from './localStorageService';

declare module "axios" {
    export interface AxiosRequestConfig {
        authorization?: boolean;
    }
}

export function createAxiosInstance(
    options: any
) {
    const api = axios.create(options);
    api.interceptors.request.use(
        (config: any) => {
            if (config.authorization !== false) {
                const token = localStorageService.getUserToken();
                if (token) {
                    config.headers.Authorization = "Bearer " + token;
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return api;
}