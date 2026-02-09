'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prayerTimeOverridesApi } from '@/lib/api';
import { CACHE_KEYS, CACHE_TTL } from '@attaqwa/shared';
import type { PrayerTimeOverride, PaginatedResponse } from '@/types';

interface UsePrayerTimeOverridesParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export function usePrayerTimeOverrides(params: UsePrayerTimeOverridesParams = {}) {
  return useQuery<PaginatedResponse<PrayerTimeOverride>>({
    queryKey: [CACHE_KEYS.PRAYER_TIME_OVERRIDES, params],
    queryFn: () => prayerTimeOverridesApi.getAll(params),
    staleTime: CACHE_TTL.SHORT,
  });
}

export function usePrayerTimeOverride(id: string) {
  return useQuery({
    queryKey: [CACHE_KEYS.PRAYER_TIME_OVERRIDES, id],
    queryFn: () => prayerTimeOverridesApi.getById(id),
    staleTime: CACHE_TTL.SHORT,
    enabled: !!id,
  });
}

export function useCreatePrayerTimeOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: prayerTimeOverridesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.PRAYER_TIME_OVERRIDES] });
    },
  });
}

export function useUpdatePrayerTimeOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PrayerTimeOverride> }) =>
      prayerTimeOverridesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.PRAYER_TIME_OVERRIDES] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.PRAYER_TIME_OVERRIDES, id] });
    },
  });
}

export function useDeletePrayerTimeOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: prayerTimeOverridesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.PRAYER_TIME_OVERRIDES] });
    },
  });
}
