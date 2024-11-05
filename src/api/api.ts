import { User } from '@/type/user.type';
import apiClient from './apiConfig';
import Cookies from "js-cookie";

export async function registerUser(email: string, name: string, password: string): Promise<User> {
    try {
        const response = await apiClient.post<User>('/user/register', { email, name, password });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || error.message);
    }
}

export async function loginUser(email: string, password: string): Promise<User> {
    try {
        const response = await apiClient.post<User>('/users/login', { email, password });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || error.message);
    }
}

export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
        const response = await apiClient.post<{ accessToken: string }>('/users/refresh-token', { refreshToken });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || error.message);
    }
}

async function handleTokenRefresh(): Promise<void> {
    const refreshToken = Cookies.get('refreshToken');
    if (refreshToken) {
        const newTokens = await refreshAccessToken(refreshToken);
        Cookies.set('accessToken', newTokens.accessToken, { secure: true, sameSite: 'strict' });
    } else {
        throw new Error('Unauthorized');
    }
}



async function handleRetryGetUser(): Promise<User> {
    try {
        await handleTokenRefresh();
        const retryResponse = await apiClient.get<User>('/user');
        return retryResponse.data;
    } catch {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        throw new Error('Unauthorized');
    }
}

export async function getUser(): Promise<User> {
    try {
        const response = await apiClient.get<User>('/user');
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            return handleRetryGetUser();
        } else {
            throw new Error(error.response?.data?.detail || error.message);
        }
    }
}

export async function logoutUser(email: string): Promise<{ message: string }> {
    try {
        const response = await apiClient.post<{ message: string }>('/users/logout', { email });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || error.message);
    }
}
