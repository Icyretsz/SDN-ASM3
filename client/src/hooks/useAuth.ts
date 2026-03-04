import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { ApiResponse, LoginCredentials, LoginDataResponse, User, UserCommentType } from '../types/api';
import { useAuthStore } from '../stores/authStore';
import { AxiosError } from 'axios';

type SignupCredentials = Omit<User, 'isAdmin' | '_id'> & { password: string }

export const useLoginMutation = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation<LoginDataResponse, AxiosError<{ message: string }>, LoginCredentials>({
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

    return useMutation<LoginDataResponse, AxiosError<{ message: string }>, SignupCredentials>({
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
export const useUpdateProfileMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation<LoginDataResponse, AxiosError<{ message: string }>, { userId: string; data: Partial<User> }>({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<User> }) => {
      const response = await api.put<ApiResponse<LoginDataResponse>>(`/auth/${userId}`, data);
      return response.data.data;
    },
    onSuccess: (data : LoginDataResponse) => {
      if (data && accessToken) {
        setAuth(data.accessToken, data.user);
      }
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation<ApiResponse<void>, AxiosError<{ message: string }>, { userId: string; oldPassword: string; newPassword: string }>({
    mutationFn: async ({ userId, oldPassword, newPassword }: { userId: string; oldPassword: string; newPassword: string }) => {
      const response = await api.put<ApiResponse<void>>(`/auth/${userId}/change-password`, {
        oldPassword,
        newPassword,
      });
      return response.data;
    },
  });
};

export const useUserComments = (userId: string) => {
  return useQuery<UserCommentType[], AxiosError<{ message: string }>>({
    queryKey: ['userComments', userId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<UserCommentType[]>>(`/auth/${userId}/comments`);
      return response.data.data;
    },
    enabled: !!userId,
  });
};

