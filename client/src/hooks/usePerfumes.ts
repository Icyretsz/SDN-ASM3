import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { Perfume, ApiResponse } from '../types/api';

export const perfumeKeys = {
  all: ['perfumes'] as const,
  lists: () => [...perfumeKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...perfumeKeys.lists(), { filters }] as const,
  details: () => [...perfumeKeys.all, 'detail'] as const,
  detail: (id: string) => [...perfumeKeys.details(), id] as const,
};

export const usePerfumesQuery = () => {

  return useQuery({
    queryKey: perfumeKeys.lists(),
    queryFn: async (): Promise<Perfume[]> => {
      const response = await api.get<ApiResponse<Perfume[]>>('/perfume');
      return response.data.data || [];
    },
  });
};

export const usePerfumeQuery = (perfumeId: string) => {
  return useQuery({
    queryKey: perfumeKeys.detail(perfumeId),
    queryFn: async (): Promise<Perfume> => {
      const response = await api.get<ApiResponse<Perfume>>(`/perfume/${perfumeId}`);
      if (!response.data.data) {
        throw new Error('Perfume not found');
      }
      return response.data.data;
    },
  });
};

export const useCreatePerfumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Perfume, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await api.post<ApiResponse<Perfume>>('/perfume', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: perfumeKeys.all });
    },
  });
};

export const useUpdatePerfumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ perfumeId, data }: { perfumeId: string; data: Partial<Perfume> }) => {
      const response = await api.put<ApiResponse<Perfume>>(`/perfume/${perfumeId}`, data);
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: perfumeKeys.all });
      queryClient.setQueryData(perfumeKeys.detail(variables.perfumeId), data);
    },
  });
};

export const useDeletePerfumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (perfumeId: number) => {
      const response = await api.delete<ApiResponse<void>>(`/perfume/${perfumeId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: perfumeKeys.all });
    },
  });
};
