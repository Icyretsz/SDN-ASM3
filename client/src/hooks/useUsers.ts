import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { User, ApiResponse } from '../types/api';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const useUsersQuery = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async (): Promise<User[]> => {
      const response = await api.get<ApiResponse<User[]>>('/auth/collector');
      return response.data.data || [];
    },
  });
};

export const useUserQuery = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: async (): Promise<User> => {
      const response = await api.get<ApiResponse<User>>(`/auth/${userId}`);
      if (!response.data.data) {
        throw new Error('User not found');
      }
      return response.data.data;
    },
    enabled: !!userId,
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string): Promise<void> => {
      await api.delete(`/auth/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};