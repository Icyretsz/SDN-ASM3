import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { Brand, ApiResponse } from '../types/api';

export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...brandKeys.lists(), { filters }] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: string) => [...brandKeys.details(), id] as const,
};

export const useBrandsQuery = () => {
  return useQuery({
    queryKey: brandKeys.lists(),
    queryFn: async (): Promise<Brand[]> => {
      const response = await api.get<ApiResponse<Brand[]>>('/brand');
      return response.data.data || [];
    },
  });
};

export const useBrandQuery = (brandId: string) => {
  return useQuery({
    queryKey: brandKeys.detail(brandId),
    queryFn: async (): Promise<Brand> => {
      const response = await api.get<ApiResponse<Brand>>(`/brand/${brandId}`);
      if (!response.data.data) {
        throw new Error('Brand not found');
      }
      return response.data.data;
    },
    enabled: !!brandId,
  });
};

export const useCreateBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { brandName: string }): Promise<Brand> => {
      const response = await api.post<ApiResponse<Brand>>('/brand', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
};

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brandId: string): Promise<void> => {
      await api.delete(`/brand/${brandId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
};