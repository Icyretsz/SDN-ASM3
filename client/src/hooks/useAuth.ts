import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import type { ApiResponse, LoginCredentials, LoginDataResponse, User } from '../types/api';
import { useAuthStore } from '../stores/authStore';

type SignupCredentials = Omit<User, 'isAdmin'>

export const useLoginMutation = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const response = await api.post<ApiResponse<LoginDataResponse>>('/auth/login', credentials);
            return response.data.data;
        },
        onSuccess: (data) => {
            if (data) {
                setAuth(data.accessToken, data.user);
            }
        },
    });
};

export const useSignupMutation = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async (credentials: SignupCredentials) => {
            const response = await api.post<ApiResponse<LoginDataResponse>>('/auth/signup', credentials);
            return response.data.data;
        },
        onSuccess: (data) => {
            if (data) {
                setAuth(data.accessToken, data.user);
            }
        },
    });
};

export const useLogout = () => {
    const clearAuth = useAuthStore((state) => state.clearAuth);

    return () => {
        clearAuth();
    };
};
