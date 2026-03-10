import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { Brand, ApiResponse } from '../types/api';
import {perfumeKeys} from './usePerfumes'

export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...brandKeys.lists(), { filters }] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: string) => [...brandKeys.details(), id] as const,
};

export const useBrandsQuery = () => {
  return useQuery({
    queryKey: brandKeys.lists(),
    queryFn: async (): Promise<Brand[]> => {
      const response = await api.get<ApiResponse<Brand[]>>('/brands');
      return response.data.data || [];
    },
  });
};

export const useBrandQuery = (brandId: string) => {
  return useQuery({
    queryKey: brandKeys.detail(brandId),
    queryFn: async (): Promise<Brand> => {
      const response = await api.get<ApiResponse<Brand>>(`/brands/${brandId}`);
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
      const response = await api.post<ApiResponse<Brand>>('/brands', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
};

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ brandId, data }: { brandId: string; data: { brandName: string } }): Promise<Brand> => {
      const response = await api.put<ApiResponse<Brand>>(`/brands/${brandId}`, data);
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      queryClient.setQueryData(brandKeys.detail(variables.brandId), data);
      queryClient.invalidateQueries({ queryKey: perfumeKeys.all })
    },
  });
};

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brandId: string): Promise<void> => {
      await api.delete(`/brands/${brandId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      queryClient.invalidateQueries({ queryKey: perfumeKeys.all })
    },
  });
};