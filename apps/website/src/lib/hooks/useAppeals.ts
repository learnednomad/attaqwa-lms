'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appealsApi } from '@/lib/api';
import { CACHE_KEYS, CACHE_TTL } from '@attaqwa/shared';
import type { Appeal, PaginatedResponse } from '@/types';

interface UseAppealsParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  category?: string;
}

export function useAppeals(params: UseAppealsParams = {}) {
  return useQuery<PaginatedResponse<Appeal>>({
    queryKey: [CACHE_KEYS.APPEALS, params],
    queryFn: () => appealsApi.getAll(params),
    staleTime: CACHE_TTL.SHORT,
  });
}

export function useAppeal(id: string) {
  return useQuery({
    queryKey: [CACHE_KEYS.APPEALS, id],
    queryFn: () => appealsApi.getById(id),
    staleTime: CACHE_TTL.SHORT,
    enabled: !!id,
  });
}

export function useCreateAppeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appealsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.APPEALS] });
    },
  });
}

export function useUpdateAppeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appeal> }) =>
      appealsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.APPEALS] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.APPEALS, id] });
    },
  });
}

export function useDeleteAppeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appealsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.APPEALS] });
    },
  });
}
