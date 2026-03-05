import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type {Perfume, ApiResponse, CommentType, User} from '../types/api';

export const perfumeKeys = {
  all: ['perfumes'] as const,
  lists: () => [...perfumeKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...perfumeKeys.lists(), { filters }] as const,
  details: () => [...perfumeKeys.all, 'detail'] as const,
  detail: (id: string) => [...perfumeKeys.details(), id] as const,
};

export const commentKeys = {
  all: (perfumeId: string) => [...perfumeKeys.detail(perfumeId), 'comments'] as const,
  detail: (perfumeId: string, commentId: string) => [...commentKeys.all(perfumeId), commentId] as const,
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
    mutationFn: async (data: Omit<Perfume, '_id' | 'comments' | 'brand'> & { brand: string }): Promise<Perfume> => {
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
    mutationFn: async ({ perfumeId, data }: { perfumeId: string; data: Partial<Omit<Perfume, '_id' | 'comments' | 'brand'> & { brand: string }> }): Promise<Perfume> => {
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
    mutationFn: async (perfumeId: string): Promise<void> => {
      await api.delete(`/perfume/${perfumeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: perfumeKeys.all });
    },
  });
};

export const useCommentsQuery = (perfumeId: string) => {
  return useQuery({
    queryKey: commentKeys.all(perfumeId),
    queryFn: async (): Promise<CommentType[]> => {
      const response = await api.get<ApiResponse<CommentType[]>>(`/perfume/${perfumeId}/comment`);
      return response.data.data || [];
    },
    enabled: !!perfumeId,
  });
};

export const useCommentQuery = (perfumeId: string, commentId: string) => {
  return useQuery({
    queryKey: commentKeys.detail(perfumeId, commentId),
    queryFn: async (): Promise<CommentType> => {
      const response = await api.get<ApiResponse<CommentType>>(`/perfume/${perfumeId}/comment/${commentId}`);
      if (!response.data.data) {
        throw new Error('Comment not found');
      }
      return response.data.data;
    },
    enabled: !!perfumeId && !!commentId,
  });
};

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ perfumeId, data }: { perfumeId: string; data: { rating: number; content: string; author: User } }) => {
      const response = await api.post<ApiResponse<Perfume>>(`/perfume/${perfumeId}/comment`, data);
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all(variables.perfumeId) });
      queryClient.invalidateQueries({ queryKey: perfumeKeys.detail(variables.perfumeId) });
    },
  });
};

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ perfumeId, commentId, data }: { perfumeId: string; commentId: string; data: { rating?: number; content?: string } }) => {
      const response = await api.put<ApiResponse<Perfume>>(`/perfume/${perfumeId}/comment/${commentId}`, data);
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all(variables.perfumeId) });
      queryClient.invalidateQueries({ queryKey: perfumeKeys.detail(variables.perfumeId) });
    },
  });
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ perfumeId, commentId }: { perfumeId: string; commentId: string }) => {
      const response = await api.delete<ApiResponse<void>>(`/perfume/${perfumeId}/comment/${commentId}`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all(variables.perfumeId) });
      queryClient.invalidateQueries({ queryKey: perfumeKeys.detail(variables.perfumeId) });
    },
  });
};
