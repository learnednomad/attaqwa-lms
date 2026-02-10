'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itikafRegistrationsApi } from '@/lib/api';
import { CACHE_KEYS, CACHE_TTL } from '@attaqwa/shared';
import type { ItikafRegistration, PaginatedResponse } from '@/types';

interface UseItikafRegistrationsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export function useItikafRegistrations(params: UseItikafRegistrationsParams = {}) {
  return useQuery<PaginatedResponse<ItikafRegistration>>({
    queryKey: [CACHE_KEYS.ITIKAF_REGISTRATIONS, params],
    queryFn: () => itikafRegistrationsApi.getAll(params),
    staleTime: CACHE_TTL.SHORT,
  });
}

export function useItikafRegistration(id: string) {
  return useQuery({
    queryKey: [CACHE_KEYS.ITIKAF_REGISTRATIONS, id],
    queryFn: () => itikafRegistrationsApi.getById(id),
    staleTime: CACHE_TTL.SHORT,
    enabled: !!id,
  });
}

export function useCreateItikafRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itikafRegistrationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ITIKAF_REGISTRATIONS] });
    },
  });
}

export function useUpdateItikafRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItikafRegistration> }) =>
      itikafRegistrationsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ITIKAF_REGISTRATIONS] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ITIKAF_REGISTRATIONS, id] });
    },
  });
}

export function useDeleteItikafRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itikafRegistrationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ITIKAF_REGISTRATIONS] });
    },
  });
}
